# Pull Request Code Review Quality Checklist

- [x] Does the change maintain 100% backwards compatibility?
- [x] Are Prisma queries routed through `BaseRepository` abstractions?
- [x] Are multi-write mutations wrapped in `$transaction` blocks?
- [x] Does the PR include unit tests with `> 95%` coverage?
- [x] Does `nest build` pass with zero TypeScript errors?
