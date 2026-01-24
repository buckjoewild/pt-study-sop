# Dashboard Rebuild

Source for the PT Study dashboard UI + API layer.

## Entry points
- `schema.ts` - Drizzle schema (shared with API + client types).
- `server/index.ts` - Express server entry.
- `client/src/App.tsx` - UI router.

## Common commands
- `npm run dev` - start dev server.
- `npm run check` - typecheck.
- `npm run build` - production build.
- `npm run db:push` - apply schema changes.

## Notes
- Production bundle is copied to `brain/static/dist` by repo scripts.
