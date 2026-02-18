# QA Issues Log

## 2026-02-16 - Manual QA Testing (Task F3)

### Summary

**Scenarios: 5/9 pass | Integration: 4 failed | VERDICT: BLOCKED**

### Critical Failures (500 Errors)

| Route       | Error                                             | Status  |
| ----------- | ------------------------------------------------- | ------- |
| `/cotizar`  | FailedToLoadModuleSSR - 500 Internal Server Error | BLOCKER |
| `/contacto` | FailedToLoadModuleSSR - 500 Internal Server Error | BLOCKER |

### Missing Content Errors (TypeError)

| Route                         | Error                                 | Status        |
| ----------------------------- | ------------------------------------- | ------------- |
| `/blog/seguridad-condominios` | TypeError - Article doesn't exist     | NEEDS CONTENT |
| `/cobertura/metropolitana`    | TypeError - Dynamic region page fails | NEEDS FIX     |

### Minor Issues

| Issue               | Severity | Notes                            |
| ------------------- | -------- | -------------------------------- |
| Missing favicon.svg | Low      | 404 on every page load           |
| No blog articles    | Info     | Shows "Próximamente" placeholder |

### Passing Pages

| Route          | Status             |
| -------------- | ------------------ |
| `/` (homepage) | PASS               |
| `/blog`        | PASS (placeholder) |
| `/cobertura`   | PASS               |
| `/admin/login` | PASS               |

### Root Cause Analysis Needed

The 500 errors on `/cotizar` and `/contacto` appear to be module loading failures during SSR. This suggests:

1. Missing or misconfigured React components
2. Convex integration not initialized (expected - not set up yet)
3. Possible import path issues

### Next Steps

1. Check server terminal for detailed error stack traces
2. Review `/cotizar` and `/contacto` page components for import issues
3. Create blog content or remove placeholder route
4. Fix dynamic region route `/cobertura/[region]`
5. Add favicon.svg to public folder
