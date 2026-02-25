# Learnings Template

Append each retro's learnings to `.tap/learnings.md` using this format. Never overwrite prior entries.

```markdown
## [YYYY-MM-DD] — [trigger: what prompted this retro]

### Findings
- [what happened] → [root cause: context/harness/feedback/scope gap] → [fix]
- [what happened] → [root cause] → [fix]

### Improvements Created
- [ticket/issue link or description] — [what it fixes]

### What Worked
- [thing that went well — keep doing this]
```

Example:

```markdown
## 2026-02-25 — Payment flow feature shipped

### Findings
- Agent used fetch() instead of API client → context gap → add API patterns to CLAUDE.md
- Agent couldn't test Stripe webhook → harness gap → configure Stripe test MCP
- Agent PR missed edge case: expired card → feedback gap → add payment error acceptance tests

### Improvements Created
- #142 Add API client patterns to CLAUDE.md
- #143 Configure Stripe test mode MCP server
- #144 Payment flow acceptance tests for error states

### What Worked
- Agent handled all UI components autonomously — component patterns in CLAUDE.md are solid
- /qa-test caught the layout regression before PR review
```
