# RQ3 & Analysis Tab — Mobile Overflow Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zero page-level horizontal scroll on phone (≤480px) for the RQ3 sub-tab and Analysis tab. Achieved via four targeted changes to `frontend/src/App.jsx`.

**File:** `frontend/src/App.jsx` (all changes here)

---

## Task 1: Global CSS containment patch

**Lines to modify:** ~986–1003 (`<style>` block)

- [ ] **Step 1: Add `html { overflow-x:hidden }` rule**

Find:
```js
body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};transition:background 0.4s;overflow-x:hidden}
```
Replace with:
```js
html{overflow-x:hidden}body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};transition:background 0.4s;overflow-x:hidden}
```

- [ ] **Step 2: Add `width:100%; max-width:100%` to scroll classes**

Find:
```js
.table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.chart-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
```
Replace with:
```js
.table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;max-width:100%}
.chart-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;max-width:100%}
```

- [ ] **Step 3: Verify no visual regression on desktop**

---

## Task 2: RQ3 ThresholdChart — responsive legend

**Lines to modify:** ~2344–2452 (the `ThresholdChart` component defined inside RQ3)

- [ ] **Step 1: Make `padR` conditional**

Find (inside `ThresholdChart`):
```js
const W=620,H=230,padL=45,padB=30,padT=20,padR=175;
```
Replace with:
```js
const legendBelow = isPhone;
const W=620,H=230,padL=45,padB=30,padT=20,padR=legendBelow?15:175;
```

- [ ] **Step 2: Wrap embedded legend in `{!legendBelow && (…)}`**

Find the legend block (starts with the comment `{/* Legend */}`):
```js
                          {/* Legend */}
                          <rect x={W-padR+10} y={padT} width={padR-16} height={130} rx={6} fill={AP.surface} stroke={AP.border}/>
                          <line x1={W-padR+20} y1={padT+14} x2={W-padR+38} y2={padT+14} stroke={lrAcc} strokeWidth={2}/>
                          <text x={W-padR+42} y={padT+17} fontSize={8} fill={AP.muted}>LR F1 (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+26} x2={W-padR+38} y2={padT+26} stroke={lrAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+29} fontSize={8} fill={AP.muted}>LR Recall (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+40} x2={W-padR+38} y2={padT+40} stroke={dtAcc} strokeWidth={2}/>
                          <text x={W-padR+42} y={padT+43} fontSize={8} fill={AP.muted}>DT F1 (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+52} x2={W-padR+38} y2={padT+52} stroke={dtAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+55} fontSize={8} fill={AP.muted}>DT Recall (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+66} x2={W-padR+38} y2={padT+66} stroke={lrAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+69} fontSize={8} fill={AP.muted}>LR F1 (No SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+78} x2={W-padR+38} y2={padT+78} stroke={dtAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+81} fontSize={8} fill={AP.muted}>DT F1 (No SMOTE)</text>
                          <circle cx={W-padR+29} cy={padT+92} r={4} fill={lrAcc} stroke={AP.surface} strokeWidth={1.5}/>
                          <text x={W-padR+42} y={padT+95} fontSize={8} fill={AP.muted}>SMOTE Optimal</text>
                          <polygon points={`${W-padR+29},${padT+103} ${W-padR+34},${padT+107} ${W-padR+29},${padT+111} ${W-padR+24},${padT+107}`} fill={dtAcc} stroke={AP.surface} strokeWidth={1.5}/>
                          <text x={W-padR+42} y={padT+110} fontSize={8} fill={AP.muted}>No SMOTE points</text>
```
Wrap that entire block:
```js
                          {/* Legend */}
                          {!legendBelow && (<>
                          <rect x={W-padR+10} y={padT} width={padR-16} height={130} rx={6} fill={AP.surface} stroke={AP.border}/>
                          <line x1={W-padR+20} y1={padT+14} x2={W-padR+38} y2={padT+14} stroke={lrAcc} strokeWidth={2}/>
                          <text x={W-padR+42} y={padT+17} fontSize={8} fill={AP.muted}>LR F1 (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+26} x2={W-padR+38} y2={padT+26} stroke={lrAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+29} fontSize={8} fill={AP.muted}>LR Recall (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+40} x2={W-padR+38} y2={padT+40} stroke={dtAcc} strokeWidth={2}/>
                          <text x={W-padR+42} y={padT+43} fontSize={8} fill={AP.muted}>DT F1 (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+52} x2={W-padR+38} y2={padT+52} stroke={dtAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+55} fontSize={8} fill={AP.muted}>DT Recall (SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+66} x2={W-padR+38} y2={padT+66} stroke={lrAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+69} fontSize={8} fill={AP.muted}>LR F1 (No SMOTE)</text>
                          <line x1={W-padR+20} y1={padT+78} x2={W-padR+38} y2={padT+78} stroke={dtAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.5}/>
                          <text x={W-padR+42} y={padT+81} fontSize={8} fill={AP.muted}>DT F1 (No SMOTE)</text>
                          <circle cx={W-padR+29} cy={padT+92} r={4} fill={lrAcc} stroke={AP.surface} strokeWidth={1.5}/>
                          <text x={W-padR+42} y={padT+95} fontSize={8} fill={AP.muted}>SMOTE Optimal</text>
                          <polygon points={`${W-padR+29},${padT+103} ${W-padR+34},${padT+107} ${W-padR+29},${padT+111} ${W-padR+24},${padT+107}`} fill={dtAcc} stroke={AP.surface} strokeWidth={1.5}/>
                          <text x={W-padR+42} y={padT+110} fontSize={8} fill={AP.muted}>No SMOTE points</text>
                          </>)}
```

- [ ] **Step 3: Add HTML legend below `<ThresholdChart/>` on phone**

Find:
```js
                        <div className="chart-scroll"><ThresholdChart/></div>
```
Replace with:
```js
                        <div className="chart-scroll"><ThresholdChart/></div>
                        {isPhone && (
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px",marginTop:10}}>
                            {[
                              {color:lrAcc, dash:false, label:"LR F1 (SMOTE)"},
                              {color:lrAcc, dash:true,  label:"LR Recall (SMOTE)"},
                              {color:dtAcc, dash:false, label:"DT F1 (SMOTE)"},
                              {color:dtAcc, dash:true,  label:"DT Recall (SMOTE)"},
                              {color:lrAcc, dotted:true, label:"LR F1 (No SMOTE)"},
                              {color:dtAcc, dotted:true, label:"DT F1 (No SMOTE)"},
                              {color:lrAcc, circle:true, label:"SMOTE Optimal"},
                              {color:dtAcc, diamond:true,label:"No SMOTE points"},
                            ].map(({color,dash,dotted,circle,diamond,label})=>(
                              <div key={label} style={{display:"flex",alignItems:"center",gap:5}}>
                                <svg width={18} height={10} style={{flexShrink:0}}>
                                  {circle  && <circle cx={9} cy={5} r={3.5} fill={color}/>}
                                  {diamond && <polygon points="9,1 13,5 9,9 5,5" fill={color}/>}
                                  {!circle && !diamond && <line x1={1} y1={5} x2={17} y2={5} stroke={color} strokeWidth={2}
                                    strokeDasharray={dotted?"2,3":dash?"4,2":undefined} opacity={dotted||dash?0.6:1}/>}
                                </svg>
                                <span style={{fontSize:10,color:AP.muted}}>{label}</span>
                              </div>
                            ))}
                          </div>
                        )}
```

Note: `lrAcc` and `dtAcc` used in the HTML legend are defined *inside* `ThresholdChart`, so they must be lifted to the outer scope. Before the `ThresholdChart` declaration, add:
```js
const lrAcc = THEMES.logistic_regression.accent;
const dtAcc = THEMES.decision_tree.accent;
```
Then remove the duplicate declarations inside `ThresholdChart` (lines ~2360–2361).

- [ ] **Step 4: Verify chart at 390px — no overflow, legend appears below as a 2-col grid**

---

## Task 3: RQ3 comparison table — card stack on phone

**Lines to modify:** ~2525–2548 (the `return (…)` block inside the IIFE for the table)

- [ ] **Step 1: Wrap existing table in `{!isPhone && (…)}`**

Find:
```js
                          return (
                            <div className="table-scroll"><div style={{minWidth:500}}>
```
Replace with:
```js
                          return (<>
                            {!isPhone && <div className="table-scroll"><div style={{minWidth:500}}>
```

And find the closing:
```js
                            </div></div>
                          );
```
Replace with:
```js
                            </div></div>}
```

- [ ] **Step 2: Add phone card-stack before the closing `</>`**

After the `{!isPhone && …}` block but before `</>)`, insert:

```js
                            {isPhone && (
                              <div style={{display:"grid",gap:8}}>
                                {tableRows.map(({model,m,accent,hi,tag},i)=>(
                                  <div key={i} style={{
                                    borderRadius:10,padding:"12px 14px",
                                    background:hi?`${accent}11`:i%2===0?AP.surface:AP.tag,
                                    border:`1px solid ${hi?accent+"44":AP.border}`,
                                  }}>
                                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                                      <span style={{fontSize:12,fontWeight:700,color:hi?accent:AP.text}}>{model}</span>
                                      {tag && <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,
                                        background:`${accent}22`,color:accent,letterSpacing:"0.05em",textTransform:"uppercase"}}>{tag}</span>}
                                    </div>
                                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                                      {[
                                        {label:"Prec.",  val:(m.precision*100).toFixed(1)+"%"},
                                        {label:"Recall", val:(m.recall*100).toFixed(1)+"%"},
                                        {label:"F1",     val:(m.f1*100).toFixed(1)+"%"},
                                        {label:"Caught", val:`${m.tp}/${m.tp+m.fn}`},
                                      ].map(({label,val})=>(
                                        <div key={label} style={{background:AP.surfaceHi,borderRadius:6,padding:"6px 8px",border:`1px solid ${AP.border}`}}>
                                          <div style={{fontSize:9,color:AP.muted,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
                                          <div style={{fontSize:13,fontWeight:700,color:hi?accent:AP.text}}>{val}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            </>);
```

- [ ] **Step 3: Verify at 390px — stacked cards, no table-scroll overflow**

---

## Task 4: Analysis transaction table — drop Business Type column on phone

**Lines to modify:** ~1687–1763 (table headers and row render inside the transaction table)

- [ ] **Step 1: Make column template conditional**

Find the header grid (line ~1688):
```js
                        <div style={{display:"grid",gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px",padding:"8px 14px",
```
Replace:
```js
                        <div style={{display:"grid",gridTemplateColumns:isPhone?"0.5fr 0.8fr 0.7fr 70px 70px 24px":"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px",padding:"8px 14px",
```

Wait — the header also needs the chevron column. Let me look more carefully. The header has 7 columns but the row has 8 (`…70px 24px`). Check line 1688 vs 1738.

- [ ] **Step 1 (corrected): Align header and row column templates**

Header (line ~1688) currently: `"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px"` — 7 cells (no chevron)
Row (line ~1738) currently: `"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px"` — 8 cells (with chevron)

On phone, drop "Business Type" (column index 1):
- Header phone template: `"0.5fr 0.7fr 0.7fr 64px 64px 70px"` (6 cells)
- Row phone template: `"0.5fr 0.7fr 0.7fr 64px 64px 70px 24px"` (7 cells, keep chevron)

Find header `gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px"`:
```js
                        <div style={{display:"grid",gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px",padding:"8px 14px",
                          background:AP.tag,borderRadius:8,marginBottom:6,border:`1px solid ${AP.tagBorder}`,alignItems:"center"}}>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>#</span>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Business Type</span>
                          <SortBtn col="amt" label="Amount"/>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Truth</span>
                          <SortBtn col="lr" label="LR Score"/>
                          <SortBtn col="dt" label="DT Score"/>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Agree?</span>
                        </div>
```
Replace with:
```js
                        <div style={{display:"grid",gridTemplateColumns:isPhone?"0.5fr 0.7fr 0.7fr 64px 64px 70px":"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px",padding:"8px 14px",
                          background:AP.tag,borderRadius:8,marginBottom:6,border:`1px solid ${AP.tagBorder}`,alignItems:"center"}}>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>#</span>
                          {!isPhone && <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Business Type</span>}
                          <SortBtn col="amt" label="Amount"/>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Truth</span>
                          <SortBtn col="lr" label="LR"/>
                          <SortBtn col="dt" label="DT"/>
                          <span style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Agree?</span>
                        </div>
```

- [ ] **Step 2: Make row column template and Business Type cell conditional**

Find the row `gridTemplateColumns` (line ~1738):
```js
                          style={{display:"grid",gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px",
```
Replace:
```js
                          style={{display:"grid",gridTemplateColumns:isPhone?"0.5fr 0.7fr 0.7fr 64px 64px 70px 24px":"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px",
```

Find the Business Type cell (line ~1747):
```js
                          <span style={{fontSize:12,color:AP.text,fontWeight:500}}>{(['Big Box Retail','E-commerce','Electronics','Food & Beverage','Gas Station','Grocery','Pharmacy/Retail','Subscription','Transportation'].find(b=>t[`business_type_${b}`]===1))||'—'}</span>
```
Replace:
```js
                          {!isPhone && <span style={{fontSize:12,color:AP.text,fontWeight:500}}>{(['Big Box Retail','E-commerce','Electronics','Food & Beverage','Gas Station','Grocery','Pharmacy/Retail','Subscription','Transportation'].find(b=>t[`business_type_${b}`]===1))||'—'}</span>}
```

- [ ] **Step 3: Remove `minWidth:650` on phone**

Find:
```js
                        <div className="table-scroll"><div style={{minWidth:650}}>
```
Replace:
```js
                        <div className="table-scroll"><div style={{minWidth:isPhone?undefined:650}}>
```

- [ ] **Step 4: Verify at 390px — 6-column table fits without overflow; at desktop — 7-column table unchanged**

---

## Task 5: Final verification pass

- [ ] Check all four breakpoints: 390px, 480px, 768px, 1100px
- [ ] RQ3: chart fits, legend below on phone, table shows cards on phone
- [ ] Analysis: transaction table fits on phone, full table on desktop
- [ ] No page-level horizontal scrollbar on any tab at 390px
- [ ] Commit

```bash
git add frontend/src/App.jsx
git commit -m "fix: RQ3 and Analysis tab mobile overflow — responsive chart legend, table cards, column drop"
```

---

## Done

Zero page-level horizontal scroll on phone across RQ3 and Analysis tabs.
