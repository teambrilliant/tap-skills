# Architecture Decisions Format

`.tap/architecture.md` is a single compressed file of architectural decisions optimized for agent consumption. NOT traditional ADRs.

## Principles

- **One file, not many** — agents load one file, not scan a directory
- **2-4 lines per decision** — the decision + the principle behind it, nothing else
- **No context/consequences sections** — agents don't need to learn *why*, they need to know *what to do*
- **Capture the principle** — not just "use X" but "use X because [principle]" so agents can apply it to novel situations
- **~50 lines for a whole project** — if it's longer, decisions are too verbose

## Format

```markdown
# Architecture Decisions

## [decision area]
[What we decided. 1-2 sentences max.]
Principle: [the underlying reason — helps agents apply this to edge cases]

## [decision area]
[What we decided.]
Principle: [why]
```

## Example

```markdown
# Architecture Decisions

## Error handling
Result<E, T> via @repo/result + @repo/safe-fn. Never throw from use-cases.
Three flavors: createSafeFn (preferred), manual ok/err, plain async. Match existing module style.
Principle: errors are data, not exceptions. Make error paths visible in types.

## Background jobs
Temporal for all async work. Workflows orchestrate (deterministic, no I/O). Activities do I/O.
Activities convert Result errors to thrown exceptions for Temporal retry semantics.
Principle: separate orchestration from execution. Let the platform handle retry/state/recovery.

## Data access
Use-case layer between routes and DB. Never call DB directly from routes.
Drizzle ORM for all queries. No raw SQL unless Drizzle can't express it.
Principle: one layer of indirection between HTTP and persistence. Testable, swappable.

## Routing
React Router for navigation + TanStack Query for server state.
Loaders for initial page data, useQuery for refetch/cache/optimistic updates.
Principle: router owns navigation, query library owns server state. Don't mix concerns.

## State management
No global state library. Server state in TanStack Query, UI state in component/context.
Principle: most "state management" is actually server cache. Treat it that way.
```

## What NOT to include

- Date, status, author (agents don't care)
- Context section (agents don't need the backstory)
- Consequences section (agents will see consequences in the code)
- Code examples (CLAUDE.md handles patterns and examples)
- Anything already in CLAUDE.md (don't duplicate)

## When to seed

During `/tap-audit`, scan for discoverable decisions:
- Consistent patterns across the codebase (same error handling everywhere = deliberate choice)
- Config that implies decisions (Temporal config = chose Temporal for background jobs)
- Package choices that constrain patterns (Drizzle = ORM-first data access)
- Existing docs/ADRs that can be compressed

Only seed decisions you're confident about from the code evidence. Don't speculate.
