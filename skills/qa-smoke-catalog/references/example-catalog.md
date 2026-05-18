# Example: a real `.tap/smoke-tests.md`

This is a complete, real smoke-test catalog for a Shopify-embedded partner back office. Use it as the canonical format reference when authoring a catalog with `qa-smoke-catalog`. Note how cases stay lean, assertions are declarative, state-dependent surfaces use `OR` alternatives, and `> ` note blocks explain *why* a case exists (cross-DB dependency, recent ticket) without instructing the runner.

---

# Smoke Tests

Post-release regression suite for the Back Office. Each case is a sequence of imperative steps an agent executes in a browser (via Chrome DevTools MCP). Run as part of the release checklist; failures should block deploy unless explicitly waived.

## Setup

- **Base URL:** https://us.juiceplus.com/pages/bo-dashboard?partner=20157927
- **Logged-in identity:** Alexa Buffum, partner ID `20157927` (US)
- **Auth:** Tests assume the session is already authenticated. Re-authenticate manually if a login page appears.
- **Tour modal:** If "Welcome to the Back Office!" appears, click **Later** before proceeding.
- **Console rule:** For every case, no `error`-level console messages should appear during execution.

## Conventions

How to write a test case in this file. Keep edits consistent.

- **Actions are imperative.** Use `Click`, `Navigate to`, `Type`, `Wait for`, `Press`.
- **Assertions are declarative.** State the fact that should hold. Do not use `Verify`, `Ensure`, or `Check` as a verb. Write `Page heading is "Customers"`, not `Verify the page heading is "Customers"`.
- **UI labels, routes, and copy in backticks, exact.** E.g. `/pages/bo-orders`, `Run Report`.
- **State-dependent alternatives are explicit.** Write `At least one row renders OR an empty-state message appears` so the test tolerates account state drift.
- **Note blocks (`> ...`) carry the WHY** — data source, ticket reference, risk rationale. They are not instructions to the runner.
- **Each case starts from a known state.** The first step either navigates to a URL or explicitly continues from the previous case's end state.
- **Case names describe user-visible behavior**, not routes. Prefer `Customer search filters the list` over `GET /bo-customers with search param`.

---

## Test case: Dashboard loads with real partner data (Exigo-backed)

> Several fields on this page are sourced from Exigo (MSSQL), not the platform's PostgreSQL DB: `Your title`, `Renewal Date`, `Business Snapshot` volumes, `Teammates`, `Destination Success` points. If Exigo is unreachable, these break independently of the rest.

- Go to the base URL
- Wait for the dashboard to render
- Greeting heading shows the partner first name (e.g. `Hi, Alexa!`)
- Personal landing page link is a `*.juiceplus.com` subdomain (e.g. `alexabuffum.juiceplus.com`)
- `Partner ID:` is displayed and matches `20157927`
- `Your title:` is present and non-empty (e.g. `P`) — Exigo
- `Renewal Date` shows a real date (not blank, not `-`) — Exigo
- `Business Snapshot` renders with `Personal Volume` and `Team Promo` tiles, each with a numeric value for both `Current month` and `Last Month` (zero acceptable, but labels and slots must be present) — Exigo
- `Orders` widget shows tabs: `All`, `Processed`, `Pending`, `Changes`
- At least one order row OR an explicit empty-state message renders under the Orders widget
- `Teammates` section renders with at least one teammate card OR an explicit empty-state message — Exigo
- `Destination Success` renders with `Total Points` (numeric) and at least one level threshold visible (e.g. `30000`, `35000`) — Exigo

## Test case: Top nav routes to all primary sections

- From the dashboard, click `Customers` in the top nav
- URL contains `/pages/bo-customers`; page heading is `Customers`
- Click `Orders` in the top nav
- URL contains `/pages/bo-orders`; page heading is `Orders & Subscriptions`
- Click `Settings` in the top nav
- URL contains `/pages/bo-settings`; page heading is `Settings`
- Click `Dashboard` in the top nav
- URL contains `/pages/bo-dashboard`; greeting heading returns

## Test case: Customers list renders with real data

- Navigate to `/pages/bo-customers?partner=20157927`
- Wait for the customers table to render
- Table header includes columns: `Name`, `Partner`, `Status`, `Contact`, `Added`, `Last Order`, `Next Ship`, `City`
- At least one customer row renders with a non-empty Name and a non-empty Added date
- Result count summary shows `X of Y Direct Customers` with X and Y as non-negative integers

## Test case: Customer search filters the list

- On the customers page, type a known substring (e.g. `alexa`) into `Search by customers...`
- Wait for the result count summary to update
- Every visible row contains the substring (case-insensitive) somewhere in Name OR Contact email
- Clear the search field
- Result count returns to the unfiltered total

## Test case: Customers table sort works

- On the customers page, click the `Added` column header
- Rows reorder (compare top row's Added date before and after the click)
- Click `Added` again
- Order reverses

## Test case: Orders page lists orders and status tabs filter

- Navigate to `/pages/bo-orders?partner=20157927`
- Page heading is `Orders & Subscriptions`
- Status tabs exist: `Processed`, `Pending`, `Payment Issues`, `Cancellations`, `Rescheduled`
- Table shows at least one order row OR an empty-state message
- Click the `Processed` tab
- Result count updates and the URL or visible state reflects the active tab
- Click `Payment Issues`
- Result count updates again (zero results is acceptable)

## Test case: Orders page-size selector works

- On the orders page, click the page-size dropdown (default `20`)
- Select a different value (e.g. `50` if available, or any non-current option)
- Table refreshes and the result count summary reflects the new page size

## Test case: Team + Reports dropdown lists all four reports

- Navigate to the dashboard
- Click the `Team + Reports` button in the top nav
- Dropdown opens (button `aria-expanded` becomes `true`)
- Dropdown contains these items, each with a link to `/pages/bo-reports?tab=...`:
  - `My Team` → `tab=my-team`
  - `Qualifications` → `tab=qualifications`
  - `Performance` → `tab=performance`
  - `Earnings + Tax` → `tab=earnings-and-tax`

## Test case: My Team downline shows real Exigo data

> The My Team downline is one of the heaviest Exigo queries (multi-level partner tree with sponsor + upline + volumes). If the Exigo connection or query path degrades, this case fails first.

- Navigate to `/pages/bo-reports?tab=my-team&partner=20157927`
- Wait for the team table to render
- Page tab bar shows: `My Team`, `Qualifications`, `Performance`, `Earnings + Tax`, with `My Team` active
- Table header includes columns: `Level`, `Name`, `Sponsor`, `Upline NMD`, `Contact`, `Title`, `Title Date`, `PB`, `POB`, `Team Promo`, `Start Date`, `Renewal Date`
- At least one downline row renders with: a non-empty Name, a non-empty Sponsor, a non-empty Upline NMD, a numeric Level, and a real Start Date
- Result count summary shows `Showing X of Y results` with X and Y as non-negative integers and Y > 0
- Tree-view / list-view toggle is present and clickable
- Toggle to tree view, then back to list view; the table still renders without console errors

## Test case: Qualifications, Performance, Earnings + Tax sub-pages render

- Navigate to `/pages/bo-reports?tab=qualifications&partner=20157927`
- Section headings exist: `PB/POB Qualifications`, `Team Promo Detail`, `Destination Success`, each with a `View Details` button
- Navigate to `/pages/bo-reports?tab=performance&partner=20157927`
- Section headings exist: `Leaderboard Report`, `12 Month Analysis`, `Downline Growth`, `Classic PVC`
- Each report tool that requires inputs shows: a `Team Member` search box, a month or format dropdown (where applicable), and a `Run Report` or `Generate Report` button
- Navigate to `/pages/bo-reports?tab=earnings-and-tax&partner=20157927`
- Section headings exist: `Commissions`, `1099`, `1099 Breakdown`
- Commissions section shows a month dropdown (defaulting to a real recent month) and a `Run Report` button

## Test case: Commissions report runs against Exigo

> This case explicitly fires an Exigo-backed report query to validate the query path end-to-end. No file export is asserted — only that the report renders or returns a valid empty state.

- Navigate to `/pages/bo-reports?tab=earnings-and-tax&partner=20157927`
- In the `Commissions` section, leave the default month selected (or pick the most recent available)
- Click `Run Report`
- Wait up to 15 seconds for the result region to update
- Either: (a) a result table / summary renders with recognizable column headers (e.g. amount, period), OR (b) an explicit empty-state message renders (e.g. "No commissions for this period")
- No `error`-level console messages appeared during the run
- No 5xx network responses were returned for the report request

## Test case: Settings shows partner identity and contact data

- Navigate to `/pages/bo-settings?partner=20157927`
- Page heading is `Settings`
- `Sponsor` section renders with a sponsor name, phone, and email
- `Personal Information` section shows: `Name`, `Date of Birth`, `Language (Partner emails)`, masked `SSN` (format `***-**-####`)
- `Business Contact Information` section shows an `Address` and `Phone Number`
- `Your Personal Link` section shows the same subdomain as on the dashboard

## Test case: Direct Deposit section reachable from Settings (NOVA-799 surface)

- On the settings page, locate the `Direct Deposit` section
- It renders either: (a) the bank details summary, OR (b) the warning `Add your bank information in order to get paid`
- `Edit` button is present for the section
- Click `Edit`
- Bank details / OTP entry flow opens (modal or page) without console errors
- Close the flow without submitting (cancel button, close X, or browser back)

## Test case: Logout from Settings

- On the settings page, scroll to the `Account` section
- Click `Log Out`
- User is redirected away from the back office (URL no longer contains `/pages/bo-`) and lands on a public/login page
- Navigation no longer shows the partner greeting
