import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Generate a short-lived upload URL for client-side file uploads.
 * Client POSTs the file to this URL and receives an Id<"_storage">.
 */
export const generateUploadUrl = mutation({
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata after a successful upload.
 * Call this after uploading to the URL returned by generateUploadUrl.
 */
export const saveFileMetadata = mutation({
  args: {
    storageId: v.id('_storage'),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  returns: v.id('files'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('files', {
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get the public URL for a file by its storage ID.
 * Returns null if the file no longer exists.
 */
export const getFileUrl = query({
  args: { storageId: v.id('_storage') },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * Delete a file from storage.
 * After deletion, any previously generated URLs will return 404.
 */
export const deleteFile = mutation({
  args: { storageId: v.id('_storage') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return null;
  },
});

/**
 * Get file metadata by storage ID.
 */
export const getFileMetadata = query({
  args: { storageId: v.id('_storage') },
  returns: v.union(
    v.object({
      _id: v.id('files'),
      storageId: v.id('_storage'),
      fileName: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('files')
      .withIndex('by_storageId', (q) => q.eq('storageId', args.storageId))
      .unique();
  },
});

/**
 * List all files, ordered by most recent first.
 */
export const listFiles = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id('files'),
      storageId: v.id('_storage'),
      fileName: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db.query('files').order('desc').take(limit);
  },
});
