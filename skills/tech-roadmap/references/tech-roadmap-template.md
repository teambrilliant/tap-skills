# Tech Roadmap Template

Use this template for tech-roadmap output. Adapt sections based on available information — mark sections as "To be determined with [stakeholder]" if the CTO needs input from others.

```markdown
# Technology Roadmap [FY/Year]
Prepared: [YYYY-MM-DD]
Prepared by: [CTO name / title]
Review cadence: Quarterly

---

## Executive Summary

[2-3 paragraphs maximum. Lead with the business outcomes this roadmap delivers, not the technology. State the total investment, the 2-3 strategic bets, and the expected business impact. End with what changes if this roadmap is NOT funded — the cost of inaction.]

---

## Product Vision

[2-3 sentences describing the future you are creating for your customers over the next 3-10 years. Customer-centric, not technology-centric.]

---

## Current State Assessment

### Where We Are Today

| Dimension | Current State | Target (12 months) |
|-----------|--------------|-------------------|
| Team model | [feature teams / empowered teams / mixed] | [target] |
| Delivery cadence | [weekly / monthly / quarterly] | [target] |
| Problem selection | [stakeholder-driven / insight-driven / mixed] | [target] |
| Funding model | [project-based / team-based / mixed] | [target] |
| Tech debt severity | [low / moderate / severe / critical] | [target] |

### Key Findings
- [2-3 bullet points on the most important gaps between current and target state]

---

## Strategic Focus Areas

### Focus Area 1: [Problem Space]

**Problem:** [What's broken or missing for customers/business]
**Business Outcome:** [Specific, measurable outcome]
**Success Metrics:**
- [Leading indicator 1]
- [Leading indicator 2]

**Risk Assessment:**
| Risk | Level | Mitigation |
|------|-------|-----------|
| Value | [low/med/high] | [how we'll validate] |
| Viability | [low/med/high] | [business model fit] |
| Usability | [low/med/high] | [how we'll test] |
| Feasibility | [low/med/high] | [technical approach] |

**Investment Approach:**
| Phase | Quarter | Investment | Milestone | Gate |
|-------|---------|------------|-----------|------|
| Discovery | Q1 | [cost/headcount] | [what we'll learn] | [evidence to proceed] |
| Validation | Q2 | [cost/headcount] | [what we'll prove] | [evidence to scale] |
| Scaling | Q3-Q4 | [cost/headcount] | [what we'll deliver] | [outcome achieved] |

**Team:** [team name, headcount, key roles]

---

### Focus Area 2: [Problem Space]

[Same structure as Focus Area 1]

---

### Focus Area 3: [Problem Space] (if applicable)

[Same structure as Focus Area 1]

---

## Infrastructure & Platform Investments

### Tech Debt Reduction
**Allocation:** [X]% of engineering capacity ([N] engineers)
**Business justification:** [How tech debt is slowing delivery — specific symptoms]
**Expected impact:** [What improves when addressed — e.g., "deploy time from 4 hours to 20 minutes"]

### Delivery Infrastructure
| Investment | What It Enables | Cost | Timeline |
|------------|----------------|------|----------|
| [CI/CD improvements] | [faster, safer releases] | [cost] | [quarter] |
| [Instrumentation] | [outcome measurement] | [cost] | [quarter] |
| [Feature flags / A/B testing] | [experimentation capability] | [cost] | [quarter] |

### Platform Capabilities
| Investment | What It Enables | Cost | Timeline |
|------------|----------------|------|----------|
| [shared service / capability] | [which teams / outcomes it unblocks] | [cost] | [quarter] |

---

## Budget Summary

### Team Investments
| Team | Focus Area | Headcount | Annual Cost | Expected Outcome |
|------|------------|-----------|-------------|-----------------|
| [team] | [focus area] | [N] | [$X] | [business outcome] |
| [team] | [focus area] | [N] | [$X] | [business outcome] |
| Platform | Infrastructure | [N] | [$X] | [delivery velocity] |

### Investment Breakdown
| Category | Amount | % of Total | Rationale |
|----------|--------|-----------|-----------|
| Strategic focus areas | [$X] | [%] | Revenue growth / retention |
| Infrastructure & platform | [$X] | [%] | Delivery velocity |
| Tech debt | [$X] | [%] | Business continuity |
| Discovery budget | [$X] | [%] | Validation before commitment |
| **Total** | **[$X]** | **100%** | |

### Why This Structure
- **Teams, not projects:** Stable teams build expertise and compound returns. Project-based funding loses 2-3 months per team to ramp-up costs each cycle.
- **Discovery budget:** 70-90% of features built without validation fail to deliver results. Discovery investment validates before committing large budgets.
- **Tech debt allocation:** Without ongoing investment, delivery velocity degrades until the business can't compete. This is business-continuity insurance.

---

## Risk Assessment

### Portfolio Risk
| Focus Area | Confidence | If It Fails | Mitigation |
|------------|-----------|-------------|-----------|
| [area 1] | [high/med/low] | [business impact] | [fallback plan] |
| [area 2] | [high/med/low] | [business impact] | [fallback plan] |

### Execution Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| [hiring delays] | [H/M/L] | [which outcomes delayed] | [plan] |
| [tech debt worse than expected] | [H/M/L] | [velocity impact] | [plan] |
| [market shift] | [H/M/L] | [strategy relevance] | [plan] |

---

## Quarterly Milestones & Review Cadence

### Q1: [Theme — e.g., "Discovery & Foundation"]
- [ ] [Focus Area 1 milestone]
- [ ] [Focus Area 2 milestone]
- [ ] [Infrastructure milestone]
- [ ] [Quarterly business review with CEO/board]

### Q2: [Theme — e.g., "Validation & Early Results"]
- [ ] [Focus Area 1 milestone]
- [ ] [Focus Area 2 milestone]
- [ ] [Infrastructure milestone]
- [ ] [Quarterly business review with CEO/board]

### Q3: [Theme — e.g., "Scaling What Works"]
- [ ] [Focus Area 1 milestone]
- [ ] [Focus Area 2 milestone]
- [ ] [Infrastructure milestone]
- [ ] [Quarterly business review with CEO/board]

### Q4: [Theme — e.g., "Outcomes & Next Year Planning"]
- [ ] [Focus Area 1 outcome assessment]
- [ ] [Focus Area 2 outcome assessment]
- [ ] [Annual retrospective]
- [ ] [Next year roadmap kickoff]

### Review Process
Each quarterly review covers:
1. **Progress vs milestones** — what shipped, what didn't, why
2. **Outcome metrics** — are we moving the business metrics?
3. **Portfolio adjustment** — double down on what's working, cut or pivot what isn't
4. **New insights** — what we learned that changes our strategy
5. **Next quarter plan** — updated milestones based on current data

---

## Appendix: Addressing Common Questions

**"Why can't I see a detailed feature list with ship dates?"**
This roadmap connects investments to business outcomes with quarterly milestones. When specific dates matter for commitments (partnerships, marketing events), teams use high-integrity commitments — dates provided by the people doing the work, backed by technical discovery. These are reliable but expensive to produce, so we use them selectively.

**"How do we know teams are productive?"**
Teams are measured on business outcomes, not features shipped. The quarterly review process assesses progress against the success metrics defined for each focus area.

**"What if a bet doesn't pay off?"**
The discovery phase (Q1) catches failures early and cheap — before we commit large budgets to scaling. Quarterly reviews adjust the portfolio: double down on what's working, pivot or stop what isn't. This is far less wasteful than building features for 12 months and discovering they don't move the needle.

**"Is the tech debt allocation really necessary?"**
Tech debt is a business-continuity risk. Without ongoing investment, delivery velocity degrades — work that takes days starts taking weeks. Companies that defer tech debt find themselves unable to respond to competitive threats or market opportunities. The allocation protects our ability to execute this roadmap.

**"Why fund teams instead of projects?"**
Project teams lose 2-3 months ramping up each cycle. Stable teams build deep expertise in their problem space, ship faster, and compound their knowledge over time. This is why the best technology companies organize around durable teams.
```
