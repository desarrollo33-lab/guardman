# Convex Development Guide

This project uses [Convex](https://convex.dev) as the reactive backend. This document provides comprehensive guidance for working with Convex.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Schema Design](#schema-design)
3. [Query Optimization](#query-optimization)
4. [Function Types](#function-types)
5. [Authentication & Authorization](#authentication--authorization)
6. [Error Handling](#error-handling)
7. [Migration Guide](#migration-guide)
8. [Best Practices Checklist](#best-practices-checklist)

---

## Quick Reference

### MCP Access

The Convex MCP server is configured. Use it to:

- Query database schema
- Read deployment configuration
- Access environment variables
- View function definitions
- Check deployment status

### Available Skills

When working with Convex, you can invoke these specialized capabilities:

1. **schema-builder** - Design and generate database schemas
2. **function-creator** - Create queries, mutations, and actions
3. **migration-helper** - Plan and execute schema migrations
4. **auth-setup** - Set up authentication and access control
5. **convex-quickstart** - Initialize new Convex backend

---

## Schema Design

### Key Principles

1. **Keep documents flat**: Avoid deeply nested arrays of objects
2. **Use relationships**: Link documents via IDs across tables
3. **Add indexes early**: Index foreign keys (userId, teamId) from the start
4. **Limit array sizes**: Arrays are capped at 8,192 items

### Good: Relational Design

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }).index('by_email', ['email']),

  posts: defineTable({
    userId: v.id('users'),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_created', ['userId', 'createdAt']),

  comments: defineTable({
    postId: v.id('posts'),
    userId: v.id('users'),
    text: v.string(),
  })
    .index('by_post', ['postId'])
    .index('by_user', ['userId']),
});
```

### Bad: Deep Nesting

```typescript
// DON'T DO THIS
export default defineSchema({
  users: defineTable({
    name: v.string(),
    posts: v.array(
      v.object({
        title: v.string(),
        comments: v.array(
          v.object({
            text: v.string(),
          })
        ),
      })
    ),
  }),
});
```

### When Arrays Are OK

- Small, bounded collections (e.g., roles, tags)
- Data that's always loaded together
- Natural limits (e.g., max 5 favorites)

```typescript
users: defineTable({
  name: v.string(),
  roles: v.array(v.union(
    v.literal("admin"),
    v.literal("editor"),
    v.literal("viewer")
  )),
}),
```

---

## Query Optimization

### Always Use Indexes

**Bad:**

```typescript
const user = await ctx.db
  .query('users')
  .filter((q) => q.eq(q.field('email'), email))
  .first();
```

**Good:**

```typescript
const user = await ctx.db
  .query('users')
  .withIndex('by_email', (q) => q.eq('email', email))
  .first();
```

### Index Strategy

1. **Single-field indexes**: For simple lookups
   - `by_user: ["userId"]`
   - `by_email: ["email"]`

2. **Compound indexes**: For filtered queries
   - `by_user_and_status: ["userId", "status"]`
   - `by_team_and_created: ["teamId", "createdAt"]`

3. **Remove redundant**: `by_a_and_b` usually covers `by_a`

---

## Function Types

### Queries (Read-Only)

```typescript
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getTask = query({
  args: { taskId: v.id('tasks') },
  returns: v.union(
    v.object({
      _id: v.id('tasks'),
      text: v.string(),
      completed: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});
```

### Mutations (Transactional Writes)

```typescript
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createTask = mutation({
  args: {
    text: v.string(),
    priority: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high'))
    ),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    return await ctx.db.insert('tasks', {
      text: args.text,
      priority: args.priority ?? 'medium',
      completed: false,
      createdAt: Date.now(),
    });
  },
});
```

### Actions (External APIs)

**Use `"use node"` directive when actions need Node.js APIs:**

```typescript
'use node'; // Required for Node.js APIs

import { action } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateTaskSuggestion = action({
  args: { prompt: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: args.prompt }],
    });

    return completion.choices[0].message.content ?? '';
  },
});
```

**Important:** If file has `"use node"`: Only actions (no queries/mutations)

---

## Authentication & Authorization

### Pattern

Every public function that accesses user data MUST verify authentication:

```typescript
export const getMyTasks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await getUserByIdentity(ctx, identity);
    return await ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
  },
});
```

### Secure Update Pattern

```typescript
export const updateTask = mutation({
  args: { taskId: v.id('tasks'), text: v.string() },
  handler: async (ctx, args) => {
    // 1. Authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // 2. Get resource
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error('Task not found');

    // 3. Authorization (ownership check)
    const user = await getUserByIdentity(ctx, identity);
    if (task.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    // 4. Update
    await ctx.db.patch(args.taskId, { text: args.text });
  },
});
```

### Access Control Best Practices

1. **Use unguessable IDs**: Always use Convex IDs or UUIDs
2. **Check ownership**: Verify the authenticated user owns the resource
3. **Never trust client**: Client can send any ID—always verify server-side

---

## Error Handling

### When to Throw vs Return Null

**Throw errors for:**

- Authentication failures
- Authorization failures
- Invalid input that should never happen
- Resource not found when ID must be valid

**Return null for:**

- Optional resources that may not exist
- Search results with no matches
- Conditional data fetching

```typescript
// Throw for auth/ownership issues
if (!identity) throw new Error('Not authenticated');
if (task.userId !== user._id) throw new Error('Unauthorized');

// Return null for optional data
export const getOptionalProfile = query({
  args: { userId: v.id('users') },
  returns: v.union(v.object({ bio: v.string() }), v.null()),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();
    return profile ?? null;
  },
});
```

---

## Migration Guide

### Safe Changes (No Migration Needed)

- Adding optional fields
- Adding new tables
- Adding indexes

### Breaking Changes (Migration Required)

#### Adding Required Field

```typescript
// Step 1: Add as optional
users: defineTable({
  name: v.string(),
  email: v.optional(v.string()),
});

// Step 2: Create migration
export const backfillEmails = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    for (const user of users) {
      if (!user.email) {
        await ctx.db.patch(user._id, {
          email: `user-${user._id}@example.com`,
        });
      }
    }
  },
});

// Step 3: Run migration
// npx convex run migrations:backfillEmails

// Step 4: Make field required
users: defineTable({
  name: v.string(),
  email: v.string(),
});
```

### Migration Patterns

For large tables, process in batches:

```typescript
export const migrateBatch = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    batchSize: v.number(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query('largeTable').take(args.batchSize);
    for (const item of items) {
      await ctx.db.patch(item._id, {
        /* migration logic */
      });
    }
    return { processed: items.length };
  },
});
```

---

## Best Practices Checklist

### Security

- [ ] All public functions validate arguments
- [ ] Authentication checks with `ctx.auth.getUserIdentity()`
- [ ] Authorization checks for resource ownership
- [ ] Only internal functions can be scheduled

### Performance

- [ ] Use `.withIndex()` instead of `.filter()`
- [ ] Index all foreign keys
- [ ] Remove redundant indexes
- [ ] Batch large operations

### Code Quality

- [ ] All promises awaited (no floating promises)
- [ ] Logic in plain TypeScript functions
- [ ] Thin query/mutation/action wrappers
- [ ] Clear error messages
- [ ] `args` and `returns` defined for all functions

### Schema Design

- [ ] Flat, relational structure
- [ ] IDs for relationships (not nested objects)
- [ ] Arrays only for small, bounded collections
- [ ] Proper validator types
- [ ] Enums use `v.union(v.literal(...))` pattern

### TypeScript

- [ ] Strict mode enabled
- [ ] No `any` types
- [ ] No `@ts-ignore` or `@ts-expect-error`

### Functions

- [ ] Scheduled functions use `internal.*` not `api.*`
- [ ] If using Node.js APIs: `"use node"` at top of file
- [ ] Actions in separate file from queries/mutations when using "use node"

---

## Common Pitfalls

1. **Don't use `.filter()` on queries**: Use `.withIndex()` instead
2. **Don't use `Date.now()` in queries**: Breaks reactivity
3. **Don't make field required immediately**: Always add as optional first
4. **Don't forget to await promises**: Causes race conditions
5. **Don't schedule `api.*` functions**: Only `internal.*` can be scheduled
6. **Don't mix "use node" with queries/mutations**: Separate files required

---

## Validator Reference

```typescript
// Primitives
v.string();
v.number();
v.boolean();
v.null();
v.id('tableName');

// Optional
v.optional(v.string());

// Union types (enums)
v.union(v.literal('a'), v.literal('b'));

// Objects
v.object({
  key: v.string(),
  nested: v.number(),
});

// Arrays
v.array(v.string());

// Records (arbitrary keys)
v.record(v.string(), v.boolean());
```

---

## Project-Specific Notes

This project (`guardman`) has the following Convex tables:

- `pages` - Site pages
- `services` - Security services offered
- `solutions` - Security solutions
- `partners` - Business partners
- `content_blocks` - Reusable content blocks
- `site_config` - Site configuration
- `communes` - Chilean communes/locations
- `locations` - Office locations
- `faqs` - Frequently asked questions
- `leads` - Contact form submissions

When adding new functionality, follow the patterns established in existing files.
