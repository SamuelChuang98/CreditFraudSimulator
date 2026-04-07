# Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Fraud Simulator app presentable on mobile screens (≤768px) for demo use.

**Architecture:** Additive CSS media queries in `index.html` targeting classNames added to key elements in `App.jsx`. JS-controlled values (drawer width) handled via a `useWindowWidth` hook. No existing inline styles removed.

**Tech Stack:** React, inline styles, CSS media queries in `index.html`

---

### Task 1: Add `useWindowWidth` hook and fix drawer width

**Files:**
- Modify: `frontend/src/App.jsx` (near top of component, and line ~473)

The drawer width is hardcoded to `430` via inline style — CSS can't override inline styles, so we fix it in JS.

- [ ] **Step 1: Add `useWindowWidth` hook near the top of `App.jsx`, just before the `ATMFraudSimulator` function**

Find this line (around line 605):
```jsx
export default function ATMFraudSimulator() {
```

Add above it:
```jsx
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}
```

- [ ] **Step 2: Use the hook inside `ATMFraudSimulator`**

Find the first line inside `ATMFraudSimulator` (around line 607 — where `useState` calls begin). Add this as the first line of the function body:

```jsx
const windowWidth = useWindowWidth();
```

- [ ] **Step 3: Make drawer width dynamic**

Find line ~473:
```jsx
position:"relative",width:430,height:"100vh",
```

Change to:
```jsx
position:"relative",width:windowWidth<=768?"100vw":430,height:"100vh",
```

- [ ] **Step 4: Commit**
```bash
git add frontend/src/App.jsx
git commit -m "Mobile: dynamic drawer width via useWindowWidth hook"
```

---

### Task 2: Add classNames to layout grids in `App.jsx`

**Files:**
- Modify: `frontend/src/App.jsx`

Add `className` to elements that need responsive grid changes. CSS will override the inline `gridTemplateColumns` via these classes.

- [ ] **Step 1: Main wrapper padding — line ~991**

Find:
```jsx
<div style={{minHeight:"100vh",background: activeTab==="analysis" ? PURPLE.bg : T.bg,padding:"32px 24px 64px",transition:"background 0.4s"}}>
```
Change to:
```jsx
<div className="main-wrapper" style={{minHeight:"100vh",background: activeTab==="analysis" ? PURPLE.bg : T.bg,padding:"32px 24px 64px",transition:"background 0.4s"}}>
```

- [ ] **Step 2: Tab bar — line ~1077**

Find:
```jsx
<div style={{display:"flex",alignItems:"center",marginTop:20,borderBottom:`1px solid ${T.border}`}}>
```
Change to:
```jsx
<div className="tab-bar" style={{display:"flex",alignItems:"center",marginTop:20,borderBottom:`1px solid ${T.border}`}}>
```

- [ ] **Step 3: Main simulator 2-column grid — line ~1093**

Find:
```jsx
<div style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,position:"relative",zIndex:1}}>
```
Change to:
```jsx
<div className="sim-main-grid" style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,position:"relative",zIndex:1}}>
```

- [ ] **Step 4: Stats cards 3-column grid — line ~1195**

Find:
```jsx
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
```
Change to:
```jsx
<div className="stats-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
```

- [ ] **Step 5: 4-column metrics row — line ~1570**

Find:
```jsx
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
```
Change to:
```jsx
<div className="metrics-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
```

- [ ] **Step 6: RQ2 feature cards 2-column grid — line ~2243 (the `gridTemplateColumns:"1fr 1fr"` inside the rq2 section)**

Find (inside `rqTab === "rq2"` section):
```jsx
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
```
Change to:
```jsx
<div className="rq2-feature-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
```

- [ ] **Step 7: Commit**
```bash
git add frontend/src/App.jsx
git commit -m "Mobile: add classNames to layout grids"
```

---

### Task 3: Wrap wide tables in scrollable containers in `App.jsx`

**Files:**
- Modify: `frontend/src/App.jsx`

Tables with many fixed columns need `overflow-x: auto` wrappers. We add a `className` to their existing parent containers.

- [ ] **Step 1: Transaction log container — line ~1292**

Find:
```jsx
<div style={{
  maxWidth:1060,margin:"20px auto 0",
  background:T.surface,borderRadius:16,
  border:`1px solid ${T.border}`,padding:28,
```
Change to:
```jsx
<div className="txn-log-container" style={{
  maxWidth:1060,margin:"20px auto 0",
  background:T.surface,borderRadius:16,
  border:`1px solid ${T.border}`,padding:28,
```

- [ ] **Step 2: Wrap the transaction log table rows in a scroll div**

Find the header row of the transaction log (line ~1326):
```jsx
<div style={{
  display:"grid",gridTemplateColumns:"1.2fr 1.5fr 0.9fr 0.9fr 0.8fr 90px 36px 28px",
  padding:"8px 14px",background:T.tag,borderRadius:8,marginBottom:6,
  border:`1px solid ${T.tagBorder}`,
}}>
```

Wrap the block containing both the header row and the `.map(...)` rows in a new div:
```jsx
<div className="table-scroll">
  <div style={{minWidth:700}}>
    {/* existing header row */}
    {/* existing mapped rows */}
  </div>
</div>
```

- [ ] **Step 3: Analysis transaction table — line ~1665**

Find the analysis table header (line ~1667):
```jsx
<div style={{display:"grid",gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px",padding:"8px 14px",
```

Wrap the header + mapped rows in:
```jsx
<div className="table-scroll">
  <div style={{minWidth:650}}>
    {/* existing header + rows */}
  </div>
</div>
```

- [ ] **Step 4: RQ3 model performance table — line ~2506**

Find:
```jsx
<div>
  <div style={{display:"grid",gridTemplateColumns:"2.4fr 1fr 1fr 1fr 1fr",padding:"7px 12px",
```

Change the outer `<div>` to:
```jsx
<div className="table-scroll">
  <div style={{minWidth:500}}>
    {/* existing header + tableRows.map */}
  </div>
</div>
```

- [ ] **Step 5: Wrap SVG chart containers**

Find each chart wrapper `<div>` that directly contains a `<svg viewBox=...` or `<ThresholdChart/>`. Add `className="chart-scroll"` to those wrappers. There are three in the RQ tabs — search for `<ThresholdChart/>` and the two SVG bar charts in RQ2 and RQ3.

For each, change:
```jsx
<div style={{background:AP.tag,...}}>
  <ThresholdChart/>
```
To:
```jsx
<div style={{background:AP.tag,...}}>
  <div className="chart-scroll">
    <ThresholdChart/>
  </div>
```

- [ ] **Step 6: Commit**
```bash
git add frontend/src/App.jsx
git commit -m "Mobile: wrap wide tables and charts in scroll containers"
```

---

### Task 4: Add media query CSS to `index.html`

**Files:**
- Modify: `frontend/index.html`

- [ ] **Step 1: Add the `<style>` block to `index.html`**

Find the closing `</head>` tag and insert before it:

```html
<style>
  @media (max-width: 768px) {
    /* Main wrapper padding */
    .main-wrapper {
      padding: 16px 12px 48px !important;
    }

    /* Tab bar — smaller font, allow wrap */
    .tab-bar {
      flex-wrap: wrap;
      gap: 4px;
    }
    .tab-bar button {
      padding: 8px 14px !important;
      font-size: 11px !important;
    }

    /* Main simulator 2-col → 1-col */
    .sim-main-grid {
      grid-template-columns: 1fr !important;
    }

    /* Stats cards 3-col → 2-col */
    .stats-grid {
      grid-template-columns: 1fr 1fr !important;
    }

    /* 4-col metrics → 2-col */
    .metrics-grid {
      grid-template-columns: 1fr 1fr !important;
    }

    /* RQ2 feature cards 2-col → 1-col */
    .rq2-feature-grid {
      grid-template-columns: 1fr !important;
    }

    /* Scrollable tables */
    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Scrollable charts */
    .chart-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Transaction log container — reduce padding on mobile */
    .txn-log-container {
      padding: 16px !important;
    }
  }
</style>
```

- [ ] **Step 2: Verify viewport meta is present (already exists — confirm)**

The file should already have:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
Confirm it's there. No change needed.

- [ ] **Step 3: Commit**
```bash
git add frontend/index.html
git commit -m "Mobile: add @media (max-width: 768px) responsive CSS"
```

---

### Task 5: Test and push

- [ ] **Step 1: Run the frontend locally**
```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Open browser DevTools → Toggle device toolbar → set to iPhone 12 (390px wide)**

Check each tab:
- Simulator: form stacks above results ✓
- Drawer: opens full-width ✓
- Transaction log: scrolls horizontally ✓
- Analysis tab: tables scroll ✓
- RQ tabs: charts scroll, feature cards single column ✓

- [ ] **Step 3: Push to GitHub**
```bash
git push
```

Vercel will auto-deploy. Verify on a real phone after deploy.
