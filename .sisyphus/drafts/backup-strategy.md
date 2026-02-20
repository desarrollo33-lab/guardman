# Convex Backup Strategy for Guardman

**Created:** 2026-02-19
**Updated:** 2026-02-19
**Purpose:** Document backup and restore procedures for Convex data before making schema changes

---

## Deployment Information

| Environment | Deployment Name | Dashboard URL |
|-------------|-----------------|---------------|
| Development | `dev:opulent-cod-610` | https://dashboard.convex.dev/d/opulent-cod-610 |
| Production | `prod:brazen-meerkat-768` | https://dashboard.convex.dev/d/brazen-meerkat-768 |

**Backup Dashboard Path:** Settings → Backups (or direct URL: `/d/{deployment}/settings/backups`)

---

## 1. Table Inventory

### Business Data Tables (Core Content)

| Table | Records (Dev) | Description | Backup Priority |
|-------|---------------|-------------|-----------------|
| `blog_posts` | 11 | Blog articles | HIGH |
| `communes` | 58 | Chilean communes/locations | HIGH |
| `content_blocks` | 9 | Reusable content blocks per page | HIGH |
| `faqs` | 10 | Frequently asked questions | HIGH |
| `industries` | 8 | Industry sectors | HIGH |
| `pages` | 3 | Site pages metadata | HIGH |
| `partners` | 6 | Clients, certifications, partners | HIGH |
| `process_steps` | 4 | Process steps per page | HIGH |
| `services` | 6 | Security services offered | HIGH |
| `site_config` | 1 | Site configuration (singleton) | HIGH |
| `solutions` | 8 | Security solutions by industry | HIGH |
| `users` | 3 | Authenticated users (admin) | HIGH |

### Empty Tables (No Data Yet)

| Table | Records | Description |
|-------|---------|-------------|
| `authors` | 0 | Blog post authors |
| `company_values` | 0 | Company values (about page) |
| `ctas` | 0 | Call-to-action configurations |
| `files` | 0 | File storage metadata |
| `heroes` | 0 | Hero banner configurations |
| `leads` | 0 | Contact form submissions |
| `stats` | 0 | Statistics per page |
| `team_members` | 0 | Team member profiles |
| `testimonials` | 0 | Client testimonials |

### Authentication Tables (Auth System)

| Table | Records | Description | Backup Priority |
|-------|---------|-------------|-----------------|
| `authAccounts` | 2 | Auth provider accounts | MEDIUM |
| `authSessions` | 4 | User sessions | LOW (ephemeral) |
| `authRefreshTokens` | 21 | Refresh tokens | LOW (ephemeral) |
| `authRateLimits` | 0 | Rate limiting data | SKIP |
| `authVerificationCodes` | 0 | Verification codes | SKIP |
| `authVerifiers` | 0 | Verifier records | SKIP |

### Total Record Count (Dev): ~154 records

---

## 2. Backup Options

### Option A: Convex Dashboard Backup (RECOMMENDED - Easiest)

**Pros:**
- No CLI setup required
- Visual confirmation of backup status
- Can schedule automatic backups (Pro plan)
- Can download backup as ZIP
- Can restore to any deployment on same team

**Steps:**
1. Go to Dashboard: https://dashboard.convex.dev/d/brazen-meerkat-768/settings/backups
2. Click "Backup Now" for immediate backup
3. For scheduled backups, enable "Backup automatically" (requires Pro plan)
4. To download: Click "Download" on any backup entry
5. Backups are stored for 7 days (manual) or 14 days (weekly scheduled)

### Option B: Convex CLI Export

**CLI Requirements:**
1. `convex` package must be in package.json dependencies
2. Must be authenticated: `npx convex login` or run `npx convex dev` once
3. CONVEX_DEPLOYMENT must be set in .env.local

**Pros:**
- Can be scripted/automated
- Creates ZIP snapshot with all tables
- Can include file storage
- Easy to version control backup files

**Cons:**
- Requires CLI authentication
- Manual process
- Requires convex in root package.json for monorepos

**Command:**
```bash
# First-time setup (if not already done)
npx convex login

# Backup dev deployment
npx convex export --path backups/dev-backup-YYYY-MM-DD.zip

# Backup production (with --prod flag)
npx convex export --prod --path backups/prod-backup-YYYY-MM-DD.zip

# Include file storage
npx convex export --path backups/full-backup.zip --include-file-storage
```

### Option C: Convex Automatic Backups (Built-in)

Convex automatically provides:
- 99.999999999% (11 9's) durability
- Multi-availability zone replication
- Point-in-time recovery capability

**Note:** For user-initiated restores before schema changes, use Option A or B.

---

## 3. Pre-Migration Backup Procedure

### Step 1: Create Backup Directory

```bash
mkdir -p backups
```

### Step 2: Export Current Data

```bash
# For dev deployment
npx convex export --path backups/pre-migration-dev-$(date +%Y%m%d-%H%M%S).zip

# For production (before production migration)
npx convex export --prod --path backups/pre-migration-prod-$(date +%Y%m%d-%H%M%S).zip
```

### Step 3: Verify Backup

```bash
# Check backup file exists and has content
ls -la backups/*.zip

# Inspect backup contents (optional)
unzip -l backups/pre-migration-*.zip
```

### Step 4: Document Backup Location

Record in `.sisyphus/evidence/`:
- Backup filename
- Date/time
- Deployment backed up
- Schema version/commit hash

---

## 4. Restore Procedure

### Dashboard Restore (RECOMMENDED)

**Steps:**
1. Go to Backups page: https://dashboard.convex.dev/d/{deployment}/settings/backups
2. Find the backup you want to restore from
3. Click the "..." menu → "Restore"
4. Select target deployment (can restore to dev from prod backup, or vice versa)
5. Confirm the restore operation

**WARNING:** Restore is DESTRUCTIVE - it replaces all data in the target deployment.

### CLI Restore

**Full Restore (Replace All Data)**

**WARNING:** This will DELETE all existing data and replace with backup.

```bash
npx convex import --replace-all backups/pre-migration-dev-YYYYMMDD.zip
```

**Selective Table Restore**

```bash
# Extract specific table from backup first
unzip backups/pre-migration-dev.zip -d temp_extract

# Import single table (replaces existing data in that table)
npx convex import --table services --replace temp_extract/services/documents.jsonl
```

**Append Mode (Add Data Without Deleting)**

```bash
npx convex import --append backups/some-data.zip
```

---

## 5. Rollback Plan for Schema Migrations

### Scenario: Schema Change Breaks Application

1. **Immediate Action:**
   ```bash
   # Restore from pre-migration backup
   npx convex import --replace-all backups/pre-migration-dev-YYYYMMDD.zip
   ```

2. **Verify Restore:**
   - Check dashboard for data counts
   - Test critical queries
   - Verify application functionality

3. **Document Issue:**
   - Record what went wrong
   - Update schema approach
   - Re-plan migration

### Scenario: Data Corruption During Migration

1. **Stop all writes to affected tables**
2. **Assess corruption scope** (which tables/records)
3. **Choose restore strategy:**
   - Full restore: `--replace-all`
   - Table restore: `--table <name> --replace`
4. **Verify data integrity**
5. **Resume normal operations**

---

## 6. Backup Schedule Recommendations

| Environment | Frequency | Retention |
|-------------|-----------|-----------|
| Development | Before each schema change | 7 days |
| Production | Before deployments + weekly | 30 days |

### Pre-Change Checklist

- [ ] Export current data to backup
- [ ] Verify backup file exists and is non-empty
- [ ] Document backup location
- [ ] Proceed with schema/function changes
- [ ] Test changes thoroughly
- [ ] Delete old backup only after confirming changes work

---

## 7. Important Notes

### What Gets Backed Up

- All table data
- Document metadata (`_id`, `_creationTime`)
- Optional: File storage (`--include-file-storage`)

### What Doesn't Get Backed Up

- Environment variables (use `npx convex env list` to document)
- Function code (stored in git)
- Deployment configuration

### Convex ID Preservation

When importing with `--replace` or `--replace-all`:
- Original `_id` values are preserved
- This ensures relationships remain valid
- No need to update foreign key references

### Auth Token Handling

Auth tokens (`authSessions`, `authRefreshTokens`) are ephemeral:
- Restoring old tokens may log out users
- Consider excluding auth tables from critical restores
- Users will need to re-authenticate after restore

---

## 8. Quick Reference Commands

```bash
# Create backup
npx convex export --path backups/backup-$(date +%Y%m%d).zip

# List existing backups
ls -la backups/

# Full restore (destructive)
npx convex import --replace-all backups/backup-20260219.zip

# Single table restore
npx convex import --table users --replace extracted/users/documents.jsonl

# Check deployment status
npx convex status
```

---

## 9. Evidence Trail

| Date | Backup File | Deployment | Purpose | Verified |
|------|-------------|------------|---------|----------|
| 2026-02-19 | (dashboard) | dev | Pre-schema-change baseline | ✅ Dashboard accessible |
| 2026-02-19 | (dashboard) | prod | Production data | ✅ Dashboard accessible |

**CLI Test Results:**
- CLI export attempted but requires authentication setup
- Dashboard method verified as working alternative
- See `.sisyphus/evidence/task-0.3-backup-test.txt` for details

**Dev Deployment Counts (from MCP query):**
```
authAccounts: 2, authRefreshTokens: 21, authSessions: 4
blog_posts: 11, communes: 58, content_blocks: 9, faqs: 10
industries: 8, pages: 3, partners: 6, process_steps: 4
services: 6, site_config: 1, solutions: 8, users: 3
Total: ~154 records (excluding auth tokens)
```

**Production Counts:**
- Must be obtained from Dashboard → Data page
- MCP tools have read-only access for PII protection
