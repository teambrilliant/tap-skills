---
name: tech-roadmap
description: Build a 12-month outcome-based technology roadmap that justifies budget to CEO and board. Use when someone says "tech roadmap", "technology roadmap", "build a roadmap", "justify budget", "board presentation", "budget justification", "12-month plan", "annual technology plan", or when a CTO needs to structure technology investments around business outcomes. Guides the CTO through assessing current state, defining strategic focus areas, mapping outcomes to investments, and producing a board-ready markdown document. Outputs to .tap/tech-roadmap.md.
---

# Tech Roadmap

Build a 12-month technology roadmap structured around business outcomes, not features. Help the CTO justify budget spend to CEO and board using the product operating model.

The core principle: every technology investment must connect to a business outcome. Boards don't care about features — they care that funded work has the potential to generate results.

## Process

1. Gather context
2. Assess current state
3. Define product vision
4. Identify strategic focus areas
5. Build the outcome map
6. Plan infrastructure & platform investments
7. Build the budget justification
8. Anticipate objections
9. Write .tap/tech-roadmap.md

### 1. Gather Context

Try to extract from the current directory first. Read if available:

```
README.md / docs/                → product overview, architecture
.tap/tap-audit.md                → prior readiness assessment
.tap/architecture.md             → architectural decisions
.tap/system-health.md            → development velocity data
package.json / Cargo.toml / etc. → stack, team structure signals
git shortlog -sn --no-merges --since="12 months ago" → team size/activity
git log --oneline --since="12 months ago" | wc -l    → velocity signal
gh repo view                     → repo description, visibility
```

If the directory doesn't contain enough context (or the skill is run from a non-project directory), ask the CTO these questions conversationally:

**Company & Product:**
- What does your company do? Who are your customers?
- What's your revenue model? (SaaS, marketplace, services, etc.)
- What are your biggest competitive threats right now?

**Team & Budget:**
- How many engineers? How are teams structured?
- Current annual technology budget (ballpark)?
- In-house vs outsourced ratio?

**Current State:**
- Do you have a product vision document? Product strategy?
- How do you currently decide what to build? (stakeholder requests, data-driven, ad hoc?)
- How severe is your tech debt situation? (1-10)
- How often do you deploy? (daily, weekly, monthly, quarterly?)

**Goals:**
- What business outcomes does the CEO care about most?
- What keeps the board up at night about technology?
- Any major initiatives already committed for the next 12 months?

Capture answers concisely — you'll use them throughout the remaining steps.

### 2. Assess Current State

Evaluate where the organization sits on four spectrums. This is not about judging — it's about knowing your starting point so the roadmap addresses real gaps.

**How you build:**
- Feature teams (told what to build) → Empowered teams (given problems to solve)
- Big-bang releases (monthly/quarterly) → Continuous delivery (daily/weekly)
- Manual testing → Automated test suite + CI/CD

**How you solve problems:**
- Build what stakeholders request → Product discovery (prototype, test, iterate)
- Output-focused (ship features) → Outcome-focused (achieve business results)

**How you decide what to build:**
- Stakeholder-driven roadmap → Insight-driven product strategy
- Annual planning with business cases → Quarterly strategy powered by data + customer insights

**How you fund the work:**
- Project-based funding → Team-based funding with outcome accountability

For each spectrum, note where the org is today and where it needs to be in 12 months. The gap between current and target state drives the transformation investments in the roadmap.

If `.tap/tap-audit.md` exists, incorporate its readiness score and leverage points into this assessment.

### 3. Define Product Vision

If a product vision exists, use it. If not, help the CTO draft one.

A product vision describes the future you are trying to create for your customers over 3-10 years. It is NOT about revenue targets or quarterly goals — it's about how customers' lives will be better.

**Guide the CTO with these prompts:**
- If your product succeeds beyond your wildest dreams, what changes for your customers?
- What would make your product indispensable rather than nice-to-have?
- What does your industry look like in 5 years, and what role does your company play?

The vision should fit in 2-3 sentences. It aligns every team and serves as the North Star for all strategic choices in this roadmap.

### 4. Identify Strategic Focus Areas

Force prioritization to 2-3 focus areas maximum. This is the hardest and most important discipline — saying no to good ideas so you can execute the great ones.

"The main thing is to keep the main thing the main thing." — Jim Barksdale

For each candidate focus area, validate against four insight sources:

| Source | Question |
|--------|----------|
| Data | What does usage data / revenue data tell us? |
| Customers | What are customers struggling with or asking for? |
| Technology | What's newly possible that wasn't before? (AI, platform shifts, etc.) |
| Industry | What are competitors doing? What trends are emerging? |

Each focus area should be a problem space, not a solution. "Reduce customer onboarding time from 14 days to 2" not "Build a self-service onboarding wizard."

### 5. Build the Outcome Map

For each strategic focus area, define:

```
### Focus Area: [problem space]

**Problem to solve:** [1-2 sentences — what's broken or missing for customers/business]
**Desired business outcome:** [specific, measurable — e.g., "reduce churn from 8% to 4%"]
**Success metrics:** [2-3 leading indicators you'll track quarterly]

**Product risks:**
- Value: [will customers care? what's the evidence?]
- Viability: [does it work for our business model?]
- Usability: [can users actually use it?]
- Feasibility: [can we build it? what's unknown?]

**Investment approach:**
- Discovery (Q1): [what to prototype and test — seed investment]
- Validation (Q2): [what evidence triggers scaling]
- Scaling (Q3-Q4): [full build-out — larger investment]

**Team assignment:** [which team(s) own this problem]
**Quarterly milestones:**
- Q1: [discovery milestone — e.g., "3 prototypes tested with 10 customers"]
- Q2: [validation milestone — e.g., "pilot with 50 users showing 30% improvement"]
- Q3: [scaling milestone — e.g., "GA launch, 500 users onboarded"]
- Q4: [outcome milestone — e.g., "churn reduced to 5%"]
```

The VC model applies here: seed small for discovery, invest substantially only when evidence supports it. This protects the company from the 70-90% failure rate of features built without validation.

### 6. Plan Infrastructure & Platform Investments

Technology infrastructure is not optional overhead — it's what enables faster time-to-money. Frame every infrastructure investment as enabling the strategic focus areas.

**Categories to consider:**

**Tech debt** (allocate 10-30% of engineering capacity):
- Frame as business-continuity risk, not engineering preference
- Symptoms: work that used to take days now takes weeks, teams blocked by dependencies
- If severe (>40% capacity consumed), this becomes a strategic focus area on its own

**Product delivery infrastructure:**
- CI/CD pipeline improvements → enables faster, safer releases
- Instrumentation & monitoring → enables outcome measurement
- Deployment infrastructure (feature flags, A/B testing) → enables experimentation

**Platform capabilities:**
- Shared services that unblock multiple teams
- Security, compliance, scalability improvements
- Data infrastructure that powers insight-driven decisions

Each investment should answer: "How does this help us achieve business outcomes faster?"

### 7. Build the Budget Justification

Structure the budget around teams, not projects. Stable teams compound returns — project-based funding creates constant churn, knowledge loss, and ramp-up costs.

**Budget structure:**

```
## Team Investments
| Team | Focus Area | Headcount | Annual Cost | Expected Outcome |
|------|------------|-----------|-------------|-----------------|

## Platform & Infrastructure
| Investment | Enables | Cost | Timeline |
|------------|---------|------|----------|

## Discovery Budget
[10-15% of total — funds rapid prototyping and experimentation before committing to full build-out]

## Tech Debt Allocation
[10-30% of engineering capacity — frame as protecting the business, not gold-plating]
```

**Key arguments for the board:**
- In the old model, 70-90% of features built don't deliver business results. This approach validates before investing.
- Fund teams, not projects: stable teams build expertise, ship faster, and compound returns over time.
- Discovery budget is insurance: spend a small amount validating before committing large amounts building.
- Tech debt allocation protects velocity — without it, delivery slows until the business can't compete.

### 8. Anticipate Objections

Pre-build responses to common CEO/board objections:

| Objection | Response |
|-----------|----------|
| "Show me the feature roadmap with dates" | The roadmap maps investments to business outcomes with quarterly milestones. When dates matter for specific commitments, teams use high-integrity commitments — dates provided by the people doing the work, backed by discovery. |
| "Why can't I see exactly what will ship?" | Because we validate before we build. Teams explore multiple approaches and ship what actually works. This is why the success rate is dramatically higher. |
| "This looks more expensive than what we do now" | Compare to the total cost of features that shipped but didn't deliver results. The old model wastes 70-90% of engineering investment. |
| "How do I know teams are being productive?" | Teams are measured on business outcomes, not features shipped. Quarterly business reviews assess progress against the metrics in this roadmap. |
| "We need to be able to redirect resources quickly" | Stable teams with broad charters adapt faster than project teams that need to ramp up. Bring work to teams, not people to projects. |
| "Our outsourcing is cheaper per engineer" | Per-engineer it looks cheaper. Per-outcome it's more expensive — outsourcing firms won't commit to business results. A smaller in-house team typically outperforms a larger outsourced team. |
| "What if the bets don't pay off?" | Product strategy manages a portfolio of bets. Not every bet will succeed, but the discovery phase catches failures early and cheap. Quarterly reviews adjust the portfolio. |

### 9. Write .tap/tech-roadmap.md

Create `.tap/` directory if it doesn't exist. Write the roadmap using the template in [references/tech-roadmap-template.md](references/tech-roadmap-template.md).

**Human mode (default):** Walk through the document section by section. Start with the executive summary. For each section, share the draft and ask for the CTO's input before moving on. The CTO knows their business — your job is to structure their thinking, not replace it.

**Review cadence:** Recommend quarterly reviews where the CTO revisits this roadmap, updates progress against milestones, adjusts bets based on new data, and prepares the next board update.

## Boundaries

- Does NOT make final strategic decisions — structures the CTO's thinking
- Does NOT produce slides (separate workflow converts the markdown)
- Does NOT implement any changes to code or infrastructure
- Does NOT access financial systems or produce exact financial projections
- Does NOT replace the CTO's judgment — challenges and refines it
- ONLY produces the roadmap document with supporting analysis
