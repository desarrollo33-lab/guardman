# Task 39: Hero Component YouTube/Image Background Support

## What Was Done

### 1. Updated `src/components/sections/Hero.astro`

**Props Interface Changes:**

- Added `background_type?: 'youtube' | 'image'`
- Added `youtube_id?: string`
- Added `image_url?: string`
- Added `mobile_image_url?: string`
- Kept `video_id?: string` for backward compatibility
- Changed data type to accept `| null` (fixes TypeScript error with index.astro)

**Logic Changes:**

- Background type defaults to `'youtube'` if not specified
- Video ID priority: `youtube_id > video_id (legacy) > default`
- Mobile image fallback chain: `mobile_image_url > image_url > YouTube poster`

**Render Changes:**

- Mobile: Always shows static image (performance optimization)
- Desktop: Shows YouTube iframe if `backgroundType === 'youtube'`, or image if `backgroundType === 'image'`

### 2. Updated `src/pages/index.astro`

- Extended `heroDataTransformed` object to pass all Convex hero fields:
  - `background_type`
  - `youtube_id`
  - `video_id` (duplicates youtube_id for legacy support)
  - `image_url`
  - `mobile_image_url`

## Schema Alignment

The Convex schema already supports these fields:

```typescript
heroes: defineTable({
  background_type: v.union(v.literal('youtube'), v.literal('image')),
  youtube_id: v.optional(v.string()),
  image_url: v.optional(v.string()),
  mobile_image_url: v.optional(v.string()),
  // ...
});
```

## Backward Compatibility

- Existing pages using `video_id` will continue to work
- Hero component checks both `youtube_id` and `video_id` with proper priority
- Default fallback video ID: `'r6OSTXanzmI'`

## Date

2026-02-18
