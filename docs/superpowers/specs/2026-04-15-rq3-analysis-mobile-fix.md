# RQ3 & Analysis Tab — Mobile Overflow Fix

**Date:** 2026-04-15
**Scope:** `frontend/src/App.jsx` — RQ3 sub-tab and Analysis tab
**Target:** phone ≤480px — zero page-level horizontal scroll, all content fits viewport width

---

## Root Causes

### 1 — SVG `overflow:"visible"` (ThresholdChart, RQ3)
The `ThresholdChart` SVG is declared with `style={{overflow:"visible"}}`. On desktop this lets the embedded right-side legend (drawn at `x = W−padR+10 = 455` in a 620-wide viewBox) and hover tooltips paint outside the SVG bounding box. On mobile the SVG scales via `width:100%`, but `overflow:visible` still permits browser paint regions beyond the SVG element's edge, extending the document scroll width.

### 2 — RQ3 comparison table `minWidth:500` (5 columns)
The "No SMOTE vs SMOTE vs Optimal Threshold" table has `<div style={{minWidth:500}}>` inside `.table-scroll`. On a phone (~456 px wide after padding) the inner div is 500 px and the grid uses fixed fr columns. The `.table-scroll` *should* scroll internally, but the embedded legend SVG overflow (root cause 1) breaks the stacking context and the table escapes containment.

### 3 — Analysis transaction table `minWidth:650` (7 columns)
Same class of issue on the Analysis tab. The transaction grid is 650 px minimum. On phone the table overflows its `.table-scroll` container, cascading to page-level overflow.

### 4 — CSS containment gap
`.table-scroll` and `.chart-scroll` lack `width:100%; max-width:100%`. Without these, `overflow-x:auto` can be bypassed when the containing block width is inferred from content rather than the viewport. Also `html` element does not have `overflow-x:hidden`, which is needed on iOS Safari to back-stop `body { overflow-x: hidden }`.

---

## Approach

All changes remain in `frontend/src/App.jsx` inline-style pattern. No new files.

### Global CSS patch
```css
html { overflow-x: hidden }
.table-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; max-width:100% }
.chart-scroll  { overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; max-width:100% }
```

### RQ3 ThresholdChart — responsive legend
- Add a `legendBelow` boolean: `const legendBelow = isPhone;`
- When `legendBelow`: set `padR = 15` (margin only) in the SVG, remove the legend `<rect>` and all legend `<line>`/`<text>` elements from the SVG
- Below the SVG, render a compact HTML `<div>` legend: 2-column grid of color-swatch + label pairs

### RQ3 comparison table — card stack on phone
- When `isPhone`: replace the `<div className="table-scroll"><div style={{minWidth:500}}>…</div></div>` block with a stacked card list. Each row becomes a small card with the model name as a header and Precision / Recall / F1 / Fraud Caught as a 2×2 mini-grid of labeled values.
- When `!isPhone`: keep existing table layout unchanged.

### Analysis transaction table — reduced columns on phone
- When `isPhone`: drop the "Business Type" column (longest text, most overflow risk). Change `gridTemplateColumns` from `"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px"` to `"0.5fr 0.7fr 0.6fr 70px 70px 24px"` (omit business-type cell). Remove the corresponding header cell and data cell in the row render.
- When `!isPhone`: unchanged.

---

## Layout Summary

| Element | Phone (≤480px) | Tablet/Desktop |
|---|---|---|
| ThresholdChart legend | HTML grid below SVG | Embedded in SVG (right side) |
| RQ3 comparison table | Stacked cards | 5-column grid table |
| Analysis txn table | 6 columns (no Biz Type) | 7 columns |
| Global CSS | html + body overflow-x:hidden; scroll divs width:100% | Same |

## Not Changed
- SMOTE impact cards (already isPhone-responsive)
- RQ1/RQ2 card grids (already fixed)
- Simulator tab
