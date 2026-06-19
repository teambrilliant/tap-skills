/* Example map — exercises every cell kind. Scaffold copies this to maps/example.js
   and registers it. Delete once the first real map is authored. */
window.Atlas.register({
  id: "example",
  title: "Example flow",
  type: "narrative",
  status: "mapped",
  updated: "2026-06-18",
  summary:
    "A worked example showing the six cell kinds — replace with your first real flow.",
  cell: { rows: ["partner"], cols: ["onboard"] },
  lovAfter: "customer",
  steps: [
    {
      num: 1,
      title: "First step",
      tag: "what happens",
      cells: {
        customer: {
          doing: "Customer does the first observable thing.",
          thinking: "“Is this for me?”",
          mot: { level: 1, text: "First small proof the product is for them." },
        },
        org: {
          backstage:
            "Service / data that powers this step (cite real anchors: <code>foo.ts</code>).",
          status: [{ k: "works" }],
          acceptance: ["An observable, testable behavior at this step."],
        },
      },
    },
    {
      num: 2,
      title: "The make-or-break step",
      tag: "the moment",
      cells: {
        customer: {
          doing: "The decisive action.",
          thinking: "“This is exactly what I needed.”",
          mot: {
            level: 2,
            text: "★★ The one moment that carries the whole flow.",
          },
        },
        org: {
          backstage: "What has to be true here.",
          status: [{ k: "wire" }, { k: "live" }],
          acceptance: [
            "The primary acceptance criterion.",
            { text: "A nice-to-have.", optional: true },
          ],
        },
      },
    },
  ],
});
