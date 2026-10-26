# Blast Radius Report Template

Omit any section with nothing in it. Plain sentences, facts verbatim.

```markdown
# Blast Radius: [PR title or branch name]
**Risk: [LOW / MEDIUM / HIGH]** — [what to focus on before merging, one line]

**What it does:** [one plain sentence]
**Size:** +[N] prod · +[N] tests · **Adds:** [new tables, endpoints, crons, deps, env vars, flags | nothing new]

**Decisions nobody asked for** (least sure first)
1. [What happens, as a scenario] — [plan/ticket didn't say]. Alt: [not taken]. **[fine / looks wrong → should be X / your call]**
2. ...

**What could break** (most likely first)
- If [situation], [what breaks] — [why: dependent, shared state, blind spot, no test].

**Check before merge**
□ [page/flow] — [what to verify]

**Odd stuff:** [scope creep, hardcoded values, orphaned code]
```

## Example

```markdown
# Blast Radius: Show Stripe invoices on Billing
**Risk: MEDIUM** — test /billing with 0 invoices and /refunds before merging.

**What it does:** Pulls a customer's invoices from Stripe into our DB and lists them on /billing.
**Size:** +420 prod · +300 tests · **Adds:** `invoices` table, `GET /api/invoices`, nightly `sync-invoices` job

**Decisions nobody asked for** (least sure first)
1. When a Stripe sync fails, the job retries 3× and then gives up silently — you'd only notice from missing invoices. Plan didn't say. Alt: alert after 3 fails. **your call** (not in log)
2. `formatMoney` now rounds to whole cents for every caller, not just invoices. Plan didn't say. Alt: a separate invoice formatter. **looks wrong** → keep the shared one as-is, format invoices locally.
3. Invoices are stored with Stripe's id as our primary key, so re-syncing updates rows instead of duplicating them. Plan didn't say. **fine**

**What could break** (most likely first)
- If a customer has 0 invoices, /billing renders the new empty state — no test covers it.
- `formatMoney` is called by 6 other pages; /refunds shows negative amounts and may now round them differently.

**Check before merge**
□ /billing as a customer with 0 invoices — empty state shows
□ /refunds — amounts match what Stripe shows
```
