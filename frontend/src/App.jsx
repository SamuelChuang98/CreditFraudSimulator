import { useState, useEffect, useRef, useMemo } from "react";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap";

// ─── Analysis tab purple palette ────────────────────────────────────────────
const PURPLE = {
  accent:    "#a855f7",
  accentDim: "#581c87",
  accentGlow:"rgba(168,85,247,0.18)",
  bg:        "#0f0a1e",
  surface:   "#160d2a",
  surfaceHi: "#1e1235",
  tag:       "#0d0820",
  tagBorder: "#2d1155",
  border:    "#2d1155",
  borderHi:  "#3d1a6e",
  text:      "#e9d5ff",
  muted:     "#7c5fa0",
  mutedHi:   "#a78cc7",
  safe:      "#4ade80",
  fraud:     "#f87171",
  amber:     "#fbbf24",
  fraudBg:   "rgba(248,113,113,0.08)",
  fraudBdr:  "rgba(248,113,113,0.3)",
  safeBg:    "rgba(74,222,128,0.08)",
  safeBdr:   "rgba(74,222,128,0.3)",
  amberBg:   "rgba(251,191,36,0.08)",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const MERCHANTS = [
  // Big Box Retail
  { name: "Walmart Canada",   type: "Big Box Retail"    },
  { name: "Costco",           type: "Big Box Retail"    },
  { name: "Target Canada",    type: "Big Box Retail"    },
  // E-commerce
  { name: "Amazon.ca",        type: "E-commerce"        },
  { name: "eBay Canada",      type: "E-commerce"        },
  { name: "Etsy",             type: "E-commerce"        },
  { name: "Wayfair",          type: "E-commerce"        },
  // Electronics
  { name: "Best Buy",         type: "Electronics"       },
  { name: "Apple Store",      type: "Electronics"       },
  { name: "The Source",       type: "Electronics"       },
  // Food & Beverage
  { name: "Tim Hortons",      type: "Food & Beverage"   },
  { name: "McDonald's",       type: "Food & Beverage"   },
  { name: "Subway",           type: "Food & Beverage"   },
  { name: "A&W",              type: "Food & Beverage"   },
  { name: "Harvey's",         type: "Food & Beverage"   },
  { name: "Boston Pizza",     type: "Food & Beverage"   },
  { name: "Swiss Chalet",     type: "Food & Beverage"   },
  // Gas Station
  { name: "Shell",            type: "Gas Station"       },
  { name: "Petro-Canada",     type: "Gas Station"       },
  { name: "Esso",             type: "Gas Station"       },
  { name: "Husky",            type: "Gas Station"       },
  { name: "Irving Oil",       type: "Gas Station"       },
  // Grocery
  { name: "Loblaws",          type: "Grocery"           },
  { name: "Sobeys",           type: "Grocery"           },
  { name: "Metro",            type: "Grocery"           },
  { name: "No Frills",        type: "Grocery"           },
  { name: "FreshCo",          type: "Grocery"           },
  { name: "Save-On-Foods",    type: "Grocery"           },
  { name: "IGA",              type: "Grocery"           },
  // Pharmacy/Retail
  { name: "Shoppers Drug Mart", type: "Pharmacy/Retail" },
  { name: "Rexall",           type: "Pharmacy/Retail"   },
  { name: "Jean Coutu",       type: "Pharmacy/Retail"   },
  // Subscription
  { name: "Netflix",          type: "Subscription"      },
  { name: "Spotify",          type: "Subscription"      },
  { name: "Disney+",          type: "Subscription"      },
  { name: "Crave",            type: "Subscription"      },
  // Transportation
  { name: "Uber",             type: "Transportation"    },
  { name: "Air Canada",       type: "Transportation"    },
  { name: "WestJet",          type: "Transportation"    },
  { name: "VIA Rail",         type: "Transportation"    },
  // Telecom
  { name: "Rogers",           type: "Telecom"           },
  { name: "Bell",             type: "Telecom"           },
  { name: "Telus",            type: "Telecom"           },
  { name: "Fido",             type: "Telecom"           },
  { name: "Koodo",            type: "Telecom"           },
  // Auto & Hardware
  { name: "Canadian Tire",    type: "Auto & Hardware"   },
  { name: "Home Depot",       type: "Auto & Hardware"   },
  { name: "RONA",             type: "Auto & Hardware"   },
  { name: "Princess Auto",    type: "Auto & Hardware"   },
  // Digital Gaming
  { name: "Steam",            type: "Digital Gaming"    },
  { name: "PlayStation Store",type: "Digital Gaming"    },
  { name: "Xbox Store",       type: "Digital Gaming"    },
  // Bookstore
  { name: "Indigo",           type: "Bookstore"         },
  { name: "Chapters",         type: "Bookstore"         },
  // Liquor
  { name: "LCBO",             type: "Liquor"            },
  { name: "BC Liquor",        type: "Liquor"            },
  { name: "SAQ",              type: "Liquor"            },
];
const CANADIAN_CITIES = [
  ["Vancouver",       "British Columbia", 49.2827,-123.1207],
  ["Victoria",        "British Columbia", 48.4284,-123.3656],
  ["Kelowna",         "British Columbia", 49.8880,-119.4960],
  ["Kamloops",        "British Columbia", 50.6745,-120.3273],
  ["Prince George",   "British Columbia", 53.9171,-122.7497],
  ["Abbotsford",      "British Columbia", 49.0504,-122.3045],
  ["Calgary",         "Alberta",          51.0447,-114.0719],
  ["Edmonton",        "Alberta",          53.5461,-113.4938],
  ["Red Deer",        "Alberta",          52.2681,-113.8112],
  ["Lethbridge",      "Alberta",          49.6956,-112.8451],
  ["Fort McMurray",   "Alberta",          56.7265,-111.3803],
  ["Medicine Hat",    "Alberta",          50.0405,-110.6762],
  ["Saskatoon",       "Saskatchewan",     52.1332,-106.6700],
  ["Regina",          "Saskatchewan",     50.4452,-104.6189],
  ["Moose Jaw",       "Saskatchewan",     50.3934,-105.5519],
  ["Prince Albert",   "Saskatchewan",     53.2033,-105.7531],
  ["Winnipeg",        "Manitoba",         49.8951, -97.1384],
  ["Brandon",         "Manitoba",         49.8485, -99.9501],
  ["Thompson",        "Manitoba",         55.7435, -97.8558],
  ["Toronto",         "Ontario",          43.6532, -79.3832],
  ["Ottawa",          "Ontario",          45.4215, -75.6972],
  ["Mississauga",     "Ontario",          43.5890, -79.6441],
  ["Hamilton",        "Ontario",          43.2557, -79.8711],
  ["London",          "Ontario",          42.9849, -81.2453],
  ["Brampton",        "Ontario",          43.7315, -79.7624],
  ["Kitchener",       "Ontario",          43.4516, -80.4925],
  ["Windsor",         "Ontario",          42.3149, -83.0364],
  ["Sudbury",         "Ontario",          46.4917, -80.9930],
  ["Thunder Bay",     "Ontario",          48.3809, -89.2477],
  ["Barrie",          "Ontario",          44.3894, -79.6903],
  ["Kingston",        "Ontario",          44.2312, -76.4860],
  ["Guelph",          "Ontario",          43.5448, -80.2482],
  ["Montreal",        "Quebec",           45.5017, -73.5673],
  ["Quebec City",     "Quebec",           46.8139, -71.2080],
  ["Laval",           "Quebec",           45.5833, -73.7500],
  ["Gatineau",        "Quebec",           45.4765, -75.7013],
  ["Sherbrooke",      "Quebec",           45.4042, -71.8929],
  ["Saguenay",        "Quebec",           48.4284, -71.0537],
  ["Trois-Rivieres",  "Quebec",           46.3432, -72.5432],
  ["Moncton",         "New Brunswick",    46.0878, -64.7782],
  ["Saint John",      "New Brunswick",    45.2733, -66.0633],
  ["Fredericton",     "New Brunswick",    45.9636, -66.6431],
  ["Halifax",         "Nova Scotia",      44.6488, -63.5752],
  ["Sydney",          "Nova Scotia",      46.1368, -60.1942],
  ["Charlottetown",   "Prince Edward Island", 46.2382, -63.1311],
  ["St. John's",      "Newfoundland",     47.5615, -52.7126],
  ["Corner Brook",    "Newfoundland",     48.9500, -57.9500],
  ["Whitehorse",      "Yukon",            60.7212,-135.0568],
  ["Yellowknife",     "Northwest Territories", 62.4540,-114.3718],
];

// Get nearest city optionally filtered to a province
function getNearestCity(lat, lng, province) {
  const pool = province
    ? CANADIAN_CITIES.filter(c => c[1] === province)
    : CANADIAN_CITIES;
  const candidates = pool.length > 0 ? pool : CANADIAN_CITIES;
  let best = candidates[0], bestDist = Infinity;
  for (const city of candidates) {
    const d = Math.sqrt((lat - city[2])**2 + (lng - city[3])**2);
    if (d < bestDist) { bestDist = d; best = city; }
  }
  return best[0];
}

// Get cities for a given province
function getCitiesForProvince(province) {
  return CANADIAN_CITIES.filter(c => c[1] === province).map(c => c[0]);
}

const CLIENT_STATS = {"100000": {"mean": 60.83, "std": 48.23, "count": 4}, "100001": {"mean": 22.88, "std": 22.62, "count": 3}, "100002": {"mean": 71.87, "std": 21.86, "count": 6}, "100003": {"mean": 102.48, "std": 50, "count": 1}, "100004": {"mean": 158.51, "std": 63.5, "count": 3}, "100005": {"mean": 35.54, "std": 29.6, "count": 3}, "100006": {"mean": 40.02, "std": 27.29, "count": 3}, "100007": {"mean": 60.91, "std": 50, "count": 1}, "100008": {"mean": 56.77, "std": 25.89, "count": 6}, "100009": {"mean": 104.29, "std": 65.5, "count": 4}, "100010": {"mean": 146.99, "std": 98.49, "count": 3}, "100011": {"mean": 70.73, "std": 41.24, "count": 8}, "100012": {"mean": 91.19, "std": 52.15, "count": 6}, "100013": {"mean": 53.7, "std": 48.37, "count": 7}, "100014": {"mean": 38.59, "std": 32.16, "count": 3}, "100015": {"mean": 90.55, "std": 48.88, "count": 4}, "100016": {"mean": 66.01, "std": 12.7, "count": 3}, "100017": {"mean": 47.77, "std": 20.52, "count": 3}, "100019": {"mean": 41.8, "std": 50, "count": 1}, "100020": {"mean": 52.37, "std": 10.39, "count": 3}, "100021": {"mean": 35.53, "std": 10, "count": 2}, "100022": {"mean": 77.14, "std": 65.56, "count": 6}, "100023": {"mean": 66.53, "std": 10.26, "count": 2}, "100024": {"mean": 50.86, "std": 28.51, "count": 4}, "100025": {"mean": 76.88, "std": 41.29, "count": 8}, "100026": {"mean": 102.06, "std": 36.98, "count": 3}, "100027": {"mean": 238.55, "std": 50, "count": 1}, "100028": {"mean": 147.76, "std": 58.04, "count": 2}, "100029": {"mean": 61.29, "std": 17.01, "count": 3}, "100030": {"mean": 136.0, "std": 92.17, "count": 2}, "100031": {"mean": 40.23, "std": 10, "count": 4}, "100032": {"mean": 101.96, "std": 49.29, "count": 6}, "100033": {"mean": 2.59, "std": 50, "count": 1}, "100034": {"mean": 132.72, "std": 140.55, "count": 4}, "100035": {"mean": 66.03, "std": 50, "count": 1}, "100036": {"mean": 55.3, "std": 15.7, "count": 2}, "100037": {"mean": 47.55, "std": 24.49, "count": 5}, "100038": {"mean": 144.75, "std": 77.36, "count": 5}, "100039": {"mean": 106.53, "std": 45.34, "count": 2}, "100040": {"mean": 103.86, "std": 76.45, "count": 7}, "100041": {"mean": 141.28, "std": 88.45, "count": 5}, "100042": {"mean": 78.43, "std": 58.94, "count": 8}, "100043": {"mean": 97.39, "std": 50.64, "count": 4}, "100044": {"mean": 68.88, "std": 24.43, "count": 2}, "100045": {"mean": 84.57, "std": 53.72, "count": 8}, "100046": {"mean": 68.01, "std": 34.26, "count": 8}, "100047": {"mean": 125.72, "std": 114.3, "count": 5}, "100048": {"mean": 95.34, "std": 50.75, "count": 3}, "100049": {"mean": 74.0, "std": 40.54, "count": 2}, "100050": {"mean": 75.73, "std": 40.96, "count": 4}, "100051": {"mean": 105.15, "std": 40.35, "count": 3}, "100052": {"mean": 71.11, "std": 28.75, "count": 8}, "100053": {"mean": 61.09, "std": 17.86, "count": 4}, "100054": {"mean": 72.43, "std": 32.67, "count": 3}, "100057": {"mean": 72.9, "std": 59.13, "count": 4}, "100058": {"mean": 74.56, "std": 33.8, "count": 4}, "100059": {"mean": 104.28, "std": 29.51, "count": 6}, "100060": {"mean": 97.75, "std": 58.91, "count": 7}, "100061": {"mean": 84.89, "std": 33.45, "count": 4}, "100062": {"mean": 71.6, "std": 46.6, "count": 6}, "100063": {"mean": 59.98, "std": 44.49, "count": 8}, "100064": {"mean": 91.33, "std": 64.58, "count": 4}, "100065": {"mean": 58.95, "std": 38.72, "count": 4}, "100066": {"mean": 90.96, "std": 55.4, "count": 7}, "100067": {"mean": 45.19, "std": 13.27, "count": 3}, "100068": {"mean": 94.98, "std": 40.8, "count": 3}, "100069": {"mean": 550.12, "std": 849.79, "count": 4}, "100070": {"mean": 108.92, "std": 15.31, "count": 5}, "100071": {"mean": 107.11, "std": 61.88, "count": 4}, "100072": {"mean": 110.14, "std": 56.95, "count": 4}, "100073": {"mean": 94.69, "std": 55.28, "count": 2}, "100074": {"mean": 51.21, "std": 28.73, "count": 3}, "100075": {"mean": 48.46, "std": 27.89, "count": 4}, "100076": {"mean": 100.84, "std": 69.81, "count": 3}, "100077": {"mean": 69.35, "std": 42.67, "count": 5}, "100078": {"mean": 79.02, "std": 64.8, "count": 4}, "100079": {"mean": 109.26, "std": 32.99, "count": 4}, "100080": {"mean": 172.28, "std": 62.99, "count": 4}, "100081": {"mean": 398.31, "std": 691.74, "count": 5}, "100082": {"mean": 84.08, "std": 72.99, "count": 4}, "100083": {"mean": 48.26, "std": 14.23, "count": 4}, "100084": {"mean": 60.05, "std": 37.32, "count": 6}, "100085": {"mean": 93.18, "std": 38.47, "count": 8}, "100086": {"mean": 57.79, "std": 30.18, "count": 5}, "100087": {"mean": 97.42, "std": 46.55, "count": 4}, "100088": {"mean": 101.36, "std": 90.86, "count": 2}, "100089": {"mean": 55.04, "std": 40.74, "count": 8}, "100090": {"mean": 66.95, "std": 39.75, "count": 5}, "100091": {"mean": 62.8, "std": 20.88, "count": 2}, "100092": {"mean": 94.13, "std": 57.71, "count": 4}, "100093": {"mean": 96.85, "std": 36.62, "count": 5}, "100094": {"mean": 55.99, "std": 18.91, "count": 3}, "100095": {"mean": 50.58, "std": 48.79, "count": 6}, "100096": {"mean": 59.49, "std": 28.8, "count": 5}, "100097": {"mean": 78.01, "std": 31.66, "count": 3}, "100098": {"mean": 89.22, "std": 34.48, "count": 4}, "100099": {"mean": 78.0, "std": 57.69, "count": 6}, "100100": {"mean": 429.04, "std": 446.54, "count": 4}, "100101": {"mean": 56.44, "std": 19.41, "count": 5}, "100102": {"mean": 52.79, "std": 28.48, "count": 4}, "100103": {"mean": 85.28, "std": 43.09, "count": 3}, "100104": {"mean": 152.52, "std": 50, "count": 1}, "100105": {"mean": 70.88, "std": 39.77, "count": 3}, "100106": {"mean": 79.39, "std": 54.26, "count": 4}, "100107": {"mean": 99.97, "std": 60.93, "count": 6}, "100108": {"mean": 107.43, "std": 103.93, "count": 5}, "100109": {"mean": 52.18, "std": 46.03, "count": 6}, "100110": {"mean": 40.2, "std": 10, "count": 2}, "100111": {"mean": 83.91, "std": 62.83, "count": 8}, "100112": {"mean": 98.27, "std": 54.22, "count": 4}, "100113": {"mean": 111.03, "std": 50, "count": 1}, "100114": {"mean": 81.94, "std": 38.25, "count": 3}, "100116": {"mean": 82.7, "std": 75.85, "count": 7}, "100117": {"mean": 99.16, "std": 52.25, "count": 2}, "100118": {"mean": 76.85, "std": 57.46, "count": 2}, "100119": {"mean": 78.93, "std": 24.95, "count": 6}, "100121": {"mean": 109.28, "std": 74.79, "count": 9}, "100122": {"mean": 139.21, "std": 45.83, "count": 4}, "100123": {"mean": 381.21, "std": 846.65, "count": 8}, "100124": {"mean": 134.49, "std": 75.8, "count": 3}, "100125": {"mean": 37.49, "std": 29.44, "count": 4}, "100126": {"mean": 73.72, "std": 69.27, "count": 9}, "100127": {"mean": 95.0, "std": 52.19, "count": 7}, "100128": {"mean": 96.43, "std": 34.54, "count": 7}, "100129": {"mean": 92.11, "std": 55.52, "count": 6}, "100130": {"mean": 62.55, "std": 10, "count": 3}, "100131": {"mean": 110.84, "std": 95.31, "count": 7}, "100132": {"mean": 74.8, "std": 28.15, "count": 6}, "100133": {"mean": 49.01, "std": 16.09, "count": 2}, "100134": {"mean": 78.78, "std": 44.22, "count": 5}, "100135": {"mean": 109.22, "std": 100.71, "count": 9}, "100136": {"mean": 109.11, "std": 62.03, "count": 3}, "100137": {"mean": 92.84, "std": 54.8, "count": 6}, "100138": {"mean": 94.52, "std": 45.14, "count": 4}, "100139": {"mean": 82.05, "std": 10, "count": 2}, "100140": {"mean": 85.39, "std": 55.03, "count": 4}, "100141": {"mean": 58.54, "std": 13.92, "count": 4}, "100142": {"mean": 59.95, "std": 51.25, "count": 4}, "100143": {"mean": 101.07, "std": 53.2, "count": 4}, "100144": {"mean": 51.3, "std": 12.5, "count": 6}, "100145": {"mean": 33.69, "std": 13.31, "count": 2}, "100146": {"mean": 110.36, "std": 32.6, "count": 4}, "100147": {"mean": 118.82, "std": 63.68, "count": 3}, "100148": {"mean": 94.52, "std": 36.83, "count": 2}, "100149": {"mean": 47.57, "std": 25.24, "count": 5}, "100150": {"mean": 81.08, "std": 31.4, "count": 5}, "100151": {"mean": 48.27, "std": 23.33, "count": 6}, "100152": {"mean": 88.5, "std": 39.38, "count": 4}, "100153": {"mean": 84.97, "std": 46.49, "count": 7}, "100154": {"mean": 17.6, "std": 50, "count": 1}, "100155": {"mean": 88.53, "std": 52.84, "count": 2}, "100156": {"mean": 74.2, "std": 35.73, "count": 6}, "100157": {"mean": 100.52, "std": 79.19, "count": 3}, "100158": {"mean": 80.64, "std": 102.63, "count": 6}, "100159": {"mean": 125.48, "std": 62.39, "count": 6}, "100160": {"mean": 175.64, "std": 108.54, "count": 4}, "100161": {"mean": 60.14, "std": 38.09, "count": 5}, "100162": {"mean": 75.41, "std": 34.08, "count": 6}, "100163": {"mean": 110.53, "std": 46.29, "count": 6}, "100164": {"mean": 18.36, "std": 13.29, "count": 3}, "100165": {"mean": 70.91, "std": 49.05, "count": 7}, "100166": {"mean": 34.8, "std": 50, "count": 1}, "100167": {"mean": 95.01, "std": 56.13, "count": 4}, "100168": {"mean": 65.15, "std": 43.18, "count": 9}, "100169": {"mean": 39.88, "std": 50, "count": 1}, "100170": {"mean": 71.04, "std": 48.08, "count": 3}, "100171": {"mean": 63.29, "std": 48.08, "count": 4}, "100172": {"mean": 97.2, "std": 60.77, "count": 7}, "100173": {"mean": 71.02, "std": 24.17, "count": 2}, "100174": {"mean": 78.7, "std": 52.67, "count": 6}, "100175": {"mean": 65.83, "std": 34.19, "count": 5}, "100176": {"mean": 92.82, "std": 38.74, "count": 4}, "100177": {"mean": 53.67, "std": 40.3, "count": 2}, "100178": {"mean": 67.79, "std": 30.87, "count": 7}, "100179": {"mean": 100.81, "std": 24.85, "count": 3}, "100180": {"mean": 87.37, "std": 26.34, "count": 6}, "100181": {"mean": 41.05, "std": 21.56, "count": 5}, "100182": {"mean": 35.63, "std": 50, "count": 1}, "100183": {"mean": 122.11, "std": 50.3, "count": 3}, "100184": {"mean": 56.72, "std": 50, "count": 1}, "100186": {"mean": 62.72, "std": 24.51, "count": 5}, "100187": {"mean": 75.68, "std": 71.15, "count": 5}, "100188": {"mean": 31.11, "std": 20.33, "count": 6}, "100189": {"mean": 71.09, "std": 60.68, "count": 4}, "100190": {"mean": 86.05, "std": 43.22, "count": 5}, "100191": {"mean": 78.18, "std": 44.27, "count": 3}, "100192": {"mean": 85.96, "std": 29.18, "count": 5}, "100193": {"mean": 52.06, "std": 15.65, "count": 4}, "100194": {"mean": 60.88, "std": 29.58, "count": 6}, "100195": {"mean": 52.87, "std": 50, "count": 1}, "100196": {"mean": 93.1, "std": 62.75, "count": 5}, "100197": {"mean": 60.96, "std": 24.32, "count": 7}, "100198": {"mean": 99.19, "std": 37.76, "count": 5}, "100199": {"mean": 96.66, "std": 14.67, "count": 3}, "100200": {"mean": 85.64, "std": 46.58, "count": 2}, "100201": {"mean": 44.84, "std": 25.32, "count": 3}, "100202": {"mean": 170.31, "std": 81.12, "count": 3}, "100203": {"mean": 287.69, "std": 505.22, "count": 6}, "100204": {"mean": 120.86, "std": 52.79, "count": 2}, "100205": {"mean": 84.06, "std": 28.51, "count": 2}, "100206": {"mean": 61.42, "std": 40.52, "count": 2}, "100207": {"mean": 88.22, "std": 43.75, "count": 4}, "100208": {"mean": 82.54, "std": 29.06, "count": 4}, "100209": {"mean": 54.74, "std": 33.66, "count": 5}, "100211": {"mean": 73.65, "std": 47.15, "count": 5}, "100212": {"mean": 56.49, "std": 15.74, "count": 2}, "100213": {"mean": 69.53, "std": 31.58, "count": 5}, "100214": {"mean": 86.23, "std": 39.56, "count": 7}, "100215": {"mean": 116.56, "std": 68.37, "count": 6}, "100216": {"mean": 105.7, "std": 57.03, "count": 3}, "100217": {"mean": 59.7, "std": 12.66, "count": 2}, "100218": {"mean": 60.05, "std": 22.25, "count": 4}, "100219": {"mean": 57.06, "std": 50, "count": 1}, "100220": {"mean": 78.25, "std": 33.58, "count": 2}, "100221": {"mean": 84.72, "std": 26.35, "count": 4}, "100222": {"mean": 64.12, "std": 42.81, "count": 6}, "100223": {"mean": 72.95, "std": 30.99, "count": 5}, "100224": {"mean": 64.22, "std": 23.35, "count": 2}, "100225": {"mean": 65.87, "std": 50.34, "count": 6}, "100226": {"mean": 111.62, "std": 37.68, "count": 3}, "100227": {"mean": 66.7, "std": 31.45, "count": 4}, "100228": {"mean": 69.29, "std": 50, "count": 1}, "100229": {"mean": 31.81, "std": 22.9, "count": 2}, "100230": {"mean": 16.18, "std": 10, "count": 2}, "100231": {"mean": 84.85, "std": 50.88, "count": 5}, "100232": {"mean": 90.95, "std": 65.89, "count": 3}, "100233": {"mean": 8.89, "std": 50, "count": 1}, "100234": {"mean": 37.48, "std": 17.97, "count": 4}, "100235": {"mean": 78.09, "std": 28.7, "count": 3}, "100236": {"mean": 111.97, "std": 26.75, "count": 4}, "100237": {"mean": 89.18, "std": 17.76, "count": 2}, "100238": {"mean": 59.97, "std": 14.94, "count": 4}, "100239": {"mean": 140.03, "std": 77.0, "count": 2}, "100240": {"mean": 115.97, "std": 73.9, "count": 6}, "100241": {"mean": 125.18, "std": 52.9, "count": 3}, "100242": {"mean": 77.37, "std": 54.54, "count": 6}, "100243": {"mean": 92.6, "std": 50, "count": 1}, "100244": {"mean": 82.9, "std": 30.51, "count": 4}, "100245": {"mean": 67.55, "std": 41.95, "count": 5}, "100246": {"mean": 87.93, "std": 48.56, "count": 4}, "100247": {"mean": 118.8, "std": 63.48, "count": 4}, "100248": {"mean": 75.86, "std": 37.46, "count": 3}, "100249": {"mean": 128.71, "std": 73.64, "count": 3}, "100250": {"mean": 88.85, "std": 44.49, "count": 5}, "100251": {"mean": 79.46, "std": 35.95, "count": 3}, "100252": {"mean": 68.3, "std": 25.47, "count": 5}, "100253": {"mean": 118.97, "std": 62.21, "count": 7}, "100254": {"mean": 85.99, "std": 33.03, "count": 3}, "100255": {"mean": 63.93, "std": 42.01, "count": 5}, "100256": {"mean": 18.32, "std": 10, "count": 2}, "100257": {"mean": 79.94, "std": 33.66, "count": 5}, "100258": {"mean": 66.5, "std": 18.93, "count": 4}, "100259": {"mean": 22.76, "std": 50, "count": 1}, "100260": {"mean": 73.32, "std": 63.29, "count": 2}, "100261": {"mean": 44.01, "std": 21.67, "count": 2}, "100262": {"mean": 123.47, "std": 50, "count": 1}, "100263": {"mean": 55.14, "std": 17.93, "count": 4}, "100264": {"mean": 25.71, "std": 13.33, "count": 2}, "100265": {"mean": 92.2, "std": 36.92, "count": 6}, "100266": {"mean": 53.62, "std": 26.97, "count": 5}, "100267": {"mean": 115.02, "std": 50, "count": 1}, "100268": {"mean": 60.71, "std": 32.01, "count": 6}, "100269": {"mean": 82.91, "std": 28.21, "count": 5}, "100270": {"mean": 63.5, "std": 50, "count": 1}, "100271": {"mean": 71.85, "std": 46.04, "count": 2}, "100272": {"mean": 54.33, "std": 60.74, "count": 5}, "100273": {"mean": 72.36, "std": 47.55, "count": 5}, "100274": {"mean": 76.37, "std": 46.48, "count": 5}, "100275": {"mean": 85.22, "std": 47.75, "count": 5}, "100276": {"mean": 70.62, "std": 46.47, "count": 3}, "100277": {"mean": 81.16, "std": 34.94, "count": 4}, "100278": {"mean": 56.96, "std": 22.43, "count": 6}, "100279": {"mean": 89.59, "std": 33.09, "count": 4}, "100280": {"mean": 392.08, "std": 826.39, "count": 8}, "100281": {"mean": 68.03, "std": 10, "count": 2}, "100282": {"mean": 117.45, "std": 75.79, "count": 4}, "100283": {"mean": 128.19, "std": 111.01, "count": 4}, "100284": {"mean": 88.1, "std": 54.14, "count": 5}, "100285": {"mean": 63.55, "std": 31.75, "count": 9}, "100286": {"mean": 74.05, "std": 10, "count": 2}, "100287": {"mean": 71.27, "std": 26.25, "count": 5}, "100288": {"mean": 71.83, "std": 32.42, "count": 4}, "100289": {"mean": 64.4, "std": 40.23, "count": 5}, "100290": {"mean": 74.78, "std": 49.09, "count": 5}, "100291": {"mean": 75.43, "std": 58.44, "count": 7}, "100292": {"mean": 65.2, "std": 39.26, "count": 7}, "100293": {"mean": 102.58, "std": 59.61, "count": 4}, "100294": {"mean": 107.01, "std": 73.95, "count": 5}, "100295": {"mean": 156.51, "std": 39.8, "count": 2}, "100296": {"mean": 74.62, "std": 26.29, "count": 8}, "100297": {"mean": 28.71, "std": 10.3, "count": 4}, "100298": {"mean": 79.96, "std": 33.18, "count": 5}, "100299": {"mean": 92.96, "std": 47.67, "count": 5}, "100301": {"mean": 169.22, "std": 37.26, "count": 3}, "100302": {"mean": 59.66, "std": 43.41, "count": 6}, "100303": {"mean": 86.27, "std": 39.23, "count": 5}, "100304": {"mean": 74.33, "std": 52.8, "count": 7}, "100305": {"mean": 60.46, "std": 19.69, "count": 7}, "100306": {"mean": 86.34, "std": 55.42, "count": 7}, "100307": {"mean": 91.98, "std": 43.76, "count": 6}, "100308": {"mean": 99.17, "std": 61.52, "count": 6}, "100309": {"mean": 52.66, "std": 10, "count": 3}, "100310": {"mean": 80.02, "std": 42.83, "count": 3}, "100311": {"mean": 46.21, "std": 20.59, "count": 6}, "100312": {"mean": 93.93, "std": 55.34, "count": 3}, "100313": {"mean": 82.25, "std": 55.3, "count": 9}, "100314": {"mean": 36.3, "std": 25.99, "count": 2}, "100315": {"mean": 53.94, "std": 20.93, "count": 3}, "100316": {"mean": 65.79, "std": 26.5, "count": 3}, "100317": {"mean": 106.3, "std": 30.43, "count": 4}, "100318": {"mean": 112.52, "std": 77.71, "count": 4}, "100319": {"mean": 140.71, "std": 44.97, "count": 3}, "100320": {"mean": 99.65, "std": 39.4, "count": 4}, "100321": {"mean": 49.11, "std": 10, "count": 3}, "100322": {"mean": 98.18, "std": 44.58, "count": 7}, "100323": {"mean": 47.41, "std": 12.35, "count": 4}, "100325": {"mean": 56.39, "std": 49.01, "count": 9}, "100326": {"mean": 64.0, "std": 39.44, "count": 4}, "100327": {"mean": 87.81, "std": 26.67, "count": 7}, "100328": {"mean": 48.51, "std": 35.01, "count": 4}, "100329": {"mean": 54.32, "std": 10.89, "count": 2}, "100330": {"mean": 78.51, "std": 10, "count": 2}, "100331": {"mean": 57.91, "std": 28.24, "count": 7}, "100332": {"mean": 36.24, "std": 10, "count": 2}, "100333": {"mean": 91.61, "std": 30.53, "count": 4}, "100334": {"mean": 134.42, "std": 66.65, "count": 5}, "100335": {"mean": 62.0, "std": 12.33, "count": 3}, "100336": {"mean": 78.29, "std": 64.5, "count": 5}, "100337": {"mean": 33.22, "std": 17.15, "count": 3}, "100338": {"mean": 87.22, "std": 25.57, "count": 3}, "100339": {"mean": 56.79, "std": 24.59, "count": 6}, "100340": {"mean": 42.91, "std": 19.3, "count": 4}, "100341": {"mean": 80.01, "std": 31.55, "count": 5}, "100342": {"mean": 155.32, "std": 82.79, "count": 3}, "100343": {"mean": 32.91, "std": 30.79, "count": 4}, "100344": {"mean": 59.81, "std": 50, "count": 1}, "100345": {"mean": 51.88, "std": 33.8, "count": 6}, "100346": {"mean": 138.51, "std": 57.23, "count": 4}, "100347": {"mean": 50.88, "std": 21.0, "count": 4}, "100348": {"mean": 56.38, "std": 25.1, "count": 5}, "100349": {"mean": 104.72, "std": 51.61, "count": 5}, "100350": {"mean": 95.36, "std": 56.93, "count": 3}, "100351": {"mean": 74.31, "std": 52.93, "count": 3}, "100352": {"mean": 97.74, "std": 61.75, "count": 6}, "100353": {"mean": 50.94, "std": 50.68, "count": 7}, "100354": {"mean": 71.95, "std": 53.37, "count": 5}, "100355": {"mean": 46.66, "std": 15.51, "count": 4}, "100356": {"mean": 75.99, "std": 49.63, "count": 6}, "100357": {"mean": 63.27, "std": 17.0, "count": 3}, "100358": {"mean": 141.41, "std": 50, "count": 1}, "100359": {"mean": 63.79, "std": 37.3, "count": 10}, "100360": {"mean": 119.52, "std": 83.96, "count": 4}, "100361": {"mean": 115.09, "std": 36.16, "count": 6}, "100362": {"mean": 45.04, "std": 13.63, "count": 4}, "100363": {"mean": 64.98, "std": 31.6, "count": 5}, "100364": {"mean": 28.04, "std": 20.18, "count": 2}, "100365": {"mean": 63.57, "std": 10, "count": 3}, "100366": {"mean": 50.48, "std": 15.97, "count": 4}, "100367": {"mean": 82.29, "std": 14.41, "count": 3}, "100369": {"mean": 41.05, "std": 23.95, "count": 6}, "100370": {"mean": 93.38, "std": 76.11, "count": 3}, "100371": {"mean": 80.56, "std": 39.81, "count": 7}, "100372": {"mean": 180.07, "std": 50, "count": 1}, "100373": {"mean": 91.89, "std": 48.27, "count": 2}, "100374": {"mean": 90.54, "std": 60.19, "count": 2}, "100375": {"mean": 72.16, "std": 50, "count": 1}, "100376": {"mean": 97.43, "std": 84.47, "count": 5}, "100377": {"mean": 143.38, "std": 48.42, "count": 2}, "100378": {"mean": 52.84, "std": 23.11, "count": 5}, "100379": {"mean": 71.8, "std": 39.33, "count": 5}, "100380": {"mean": 73.66, "std": 20.2, "count": 2}, "100381": {"mean": 101.74, "std": 72.5, "count": 3}, "100382": {"mean": 36.73, "std": 50, "count": 1}, "100383": {"mean": 52.15, "std": 31.11, "count": 5}, "100384": {"mean": 71.12, "std": 34.24, "count": 5}, "100385": {"mean": 76.84, "std": 10, "count": 2}, "100386": {"mean": 125.3, "std": 82.2, "count": 4}, "100387": {"mean": 202.59, "std": 50, "count": 1}, "100388": {"mean": 77.09, "std": 20.21, "count": 2}, "100389": {"mean": 74.45, "std": 52.28, "count": 8}, "100390": {"mean": 77.53, "std": 63.26, "count": 3}, "100391": {"mean": 57.73, "std": 30.67, "count": 3}, "100392": {"mean": 100.85, "std": 55.04, "count": 4}, "100393": {"mean": 76.84, "std": 36.9, "count": 4}, "100394": {"mean": 77.12, "std": 22.03, "count": 4}, "100395": {"mean": 87.67, "std": 39.57, "count": 4}, "100396": {"mean": 83.23, "std": 31.82, "count": 4}, "100397": {"mean": 84.1, "std": 25.15, "count": 5}, "100398": {"mean": 76.36, "std": 65.63, "count": 9}, "100399": {"mean": 595.77, "std": 898.3, "count": 4}, "100400": {"mean": 72.01, "std": 33.81, "count": 4}, "100401": {"mean": 84.05, "std": 50, "count": 1}, "100402": {"mean": 47.64, "std": 27.91, "count": 5}, "100403": {"mean": 97.67, "std": 57.68, "count": 6}, "100404": {"mean": 66.42, "std": 27.89, "count": 7}, "100405": {"mean": 64.96, "std": 46.97, "count": 7}, "100406": {"mean": 93.93, "std": 29.72, "count": 4}, "100407": {"mean": 41.21, "std": 25.37, "count": 3}, "100408": {"mean": 92.1, "std": 36.59, "count": 5}, "100409": {"mean": 65.53, "std": 28.93, "count": 6}, "100410": {"mean": 66.53, "std": 48.93, "count": 2}, "100411": {"mean": 45.92, "std": 34.46, "count": 4}, "100412": {"mean": 43.36, "std": 19.0, "count": 3}, "100413": {"mean": 62.68, "std": 52.21, "count": 6}, "100414": {"mean": 92.06, "std": 55.01, "count": 9}, "100415": {"mean": 112.66, "std": 62.92, "count": 4}, "100416": {"mean": 102.87, "std": 70.49, "count": 4}, "100417": {"mean": 2388.28, "std": 50, "count": 1}, "100418": {"mean": 95.6, "std": 46.28, "count": 5}, "100419": {"mean": 82.67, "std": 50, "count": 1}, "100420": {"mean": 80.09, "std": 45.49, "count": 6}, "100421": {"mean": 88.78, "std": 10, "count": 2}, "100422": {"mean": 53.91, "std": 17.85, "count": 2}, "100423": {"mean": 72.25, "std": 34.15, "count": 8}, "100424": {"mean": 89.36, "std": 14.83, "count": 2}, "100425": {"mean": 122.18, "std": 57.01, "count": 3}, "100426": {"mean": 83.53, "std": 64.73, "count": 4}, "100427": {"mean": 68.62, "std": 36.53, "count": 11}, "100428": {"mean": 71.3, "std": 40.48, "count": 8}, "100429": {"mean": 89.73, "std": 45.81, "count": 7}, "100430": {"mean": 75.5, "std": 49.33, "count": 8}, "100431": {"mean": 34.82, "std": 13.55, "count": 3}, "100432": {"mean": 84.52, "std": 31.91, "count": 7}, "100433": {"mean": 62.62, "std": 26.09, "count": 8}, "100434": {"mean": 679.24, "std": 1127.16, "count": 5}, "100435": {"mean": 78.68, "std": 58.8, "count": 11}, "100436": {"mean": 128.0, "std": 52.13, "count": 2}, "100437": {"mean": 60.95, "std": 28.91, "count": 2}, "100438": {"mean": 78.91, "std": 68.78, "count": 4}, "100439": {"mean": 76.94, "std": 41.86, "count": 6}, "100440": {"mean": 154.45, "std": 50, "count": 1}, "100441": {"mean": 104.33, "std": 90.7, "count": 4}, "100442": {"mean": 48.5, "std": 26.35, "count": 3}, "100443": {"mean": 108.72, "std": 64.53, "count": 6}, "100444": {"mean": 65.39, "std": 33.23, "count": 7}, "100445": {"mean": 33.37, "std": 28.9, "count": 4}, "100446": {"mean": 83.6, "std": 10.59, "count": 2}, "100447": {"mean": 39.13, "std": 28.63, "count": 5}, "100448": {"mean": 37.34, "std": 25.67, "count": 4}, "100449": {"mean": 67.28, "std": 37.85, "count": 6}, "100450": {"mean": 108.76, "std": 48.46, "count": 5}, "100451": {"mean": 80.66, "std": 80.81, "count": 3}, "100452": {"mean": 67.84, "std": 50, "count": 1}, "100453": {"mean": 127.01, "std": 50, "count": 1}, "100454": {"mean": 82.25, "std": 75.39, "count": 3}, "100455": {"mean": 107.67, "std": 59.67, "count": 4}, "100456": {"mean": 104.36, "std": 53.62, "count": 7}, "100457": {"mean": 74.79, "std": 44.69, "count": 5}, "100458": {"mean": 67.8, "std": 25.17, "count": 5}, "100459": {"mean": 54.99, "std": 20.14, "count": 3}, "100460": {"mean": 56.85, "std": 41.05, "count": 4}, "100461": {"mean": 25.65, "std": 10, "count": 2}, "100462": {"mean": 103.19, "std": 50, "count": 1}, "100463": {"mean": 74.08, "std": 54.15, "count": 6}, "100464": {"mean": 18.17, "std": 10, "count": 2}, "100465": {"mean": 138.93, "std": 72.44, "count": 6}, "100466": {"mean": 57.53, "std": 46.82, "count": 2}, "100467": {"mean": 64.89, "std": 37.54, "count": 4}, "100468": {"mean": 67.05, "std": 26.54, "count": 5}, "100469": {"mean": 43.04, "std": 20.71, "count": 5}, "100470": {"mean": 55.57, "std": 30.63, "count": 3}, "100471": {"mean": 54.2, "std": 28.88, "count": 3}, "100472": {"mean": 64.77, "std": 40.47, "count": 2}, "100473": {"mean": 37.2, "std": 25.07, "count": 2}, "100474": {"mean": 32.63, "std": 10, "count": 3}, "100475": {"mean": 108.65, "std": 73.25, "count": 6}, "100476": {"mean": 44.38, "std": 22.16, "count": 4}, "100477": {"mean": 94.56, "std": 67.53, "count": 4}, "100478": {"mean": 28.29, "std": 11.66, "count": 2}, "100479": {"mean": 90.73, "std": 57.37, "count": 5}, "100480": {"mean": 157.37, "std": 36.38, "count": 2}, "100481": {"mean": 102.89, "std": 99.68, "count": 9}, "100482": {"mean": 67.78, "std": 29.65, "count": 4}, "100483": {"mean": 87.8, "std": 10, "count": 2}, "100484": {"mean": 53.94, "std": 32.7, "count": 4}, "100485": {"mean": 74.89, "std": 51.26, "count": 4}, "100486": {"mean": 54.88, "std": 12.6, "count": 5}, "100487": {"mean": 71.18, "std": 50, "count": 1}, "100488": {"mean": 86.33, "std": 24.76, "count": 4}, "100489": {"mean": 91.37, "std": 25.34, "count": 3}, "100490": {"mean": 83.22, "std": 29.17, "count": 6}, "100491": {"mean": 35.59, "std": 50, "count": 1}, "100492": {"mean": 90.38, "std": 95.73, "count": 3}, "100493": {"mean": 35.41, "std": 10, "count": 2}, "100494": {"mean": 90.81, "std": 25.91, "count": 5}, "100495": {"mean": 99.72, "std": 19.45, "count": 4}, "100496": {"mean": 48.67, "std": 10, "count": 3}, "100497": {"mean": 78.27, "std": 33.02, "count": 5}, "100498": {"mean": 501.96, "std": 856.48, "count": 5}, "100499": {"mean": 82.24, "std": 56.18, "count": 3}, "100500": {"mean": 89.58, "std": 43.61, "count": 2}, "100501": {"mean": 81.53, "std": 74.39, "count": 7}, "100502": {"mean": 72.68, "std": 46.49, "count": 6}, "100503": {"mean": 133.76, "std": 10, "count": 2}, "100504": {"mean": 102.56, "std": 53.86, "count": 3}, "100505": {"mean": 64.03, "std": 54.47, "count": 5}, "100506": {"mean": 51.52, "std": 18.91, "count": 4}, "100507": {"mean": 100.89, "std": 42.3, "count": 2}, "100508": {"mean": 43.66, "std": 50, "count": 1}, "100509": {"mean": 44.12, "std": 35.27, "count": 4}, "100510": {"mean": 63.96, "std": 10, "count": 2}, "100511": {"mean": 129.44, "std": 21.42, "count": 3}, "100512": {"mean": 133.74, "std": 48.24, "count": 4}, "100513": {"mean": 120.03, "std": 73.2, "count": 5}, "100514": {"mean": 112.59, "std": 70.73, "count": 5}, "100515": {"mean": 53.73, "std": 48.62, "count": 8}, "100516": {"mean": 106.58, "std": 49.5, "count": 4}, "100517": {"mean": 51.66, "std": 26.51, "count": 4}, "100518": {"mean": 97.95, "std": 22.6, "count": 4}, "100519": {"mean": 50.49, "std": 10, "count": 3}, "100520": {"mean": 64.14, "std": 18.18, "count": 4}, "100521": {"mean": 142.76, "std": 66.21, "count": 3}, "100522": {"mean": 53.22, "std": 12.12, "count": 2}, "100523": {"mean": 122.2, "std": 73.92, "count": 2}, "100524": {"mean": 59.88, "std": 52.5, "count": 8}, "100525": {"mean": 79.24, "std": 21.36, "count": 3}, "100526": {"mean": 90.2, "std": 28.07, "count": 5}, "100527": {"mean": 86.44, "std": 48.45, "count": 4}, "100528": {"mean": 83.78, "std": 21.81, "count": 4}, "100529": {"mean": 40.7, "std": 23.11, "count": 7}, "100530": {"mean": 91.59, "std": 80.45, "count": 5}, "100531": {"mean": 110.79, "std": 60.64, "count": 8}, "100532": {"mean": 29.39, "std": 13.89, "count": 2}, "100533": {"mean": 148.4, "std": 109.13, "count": 3}, "100534": {"mean": 65.79, "std": 34.82, "count": 7}, "100535": {"mean": 92.77, "std": 47.83, "count": 4}, "100536": {"mean": 45.46, "std": 23.18, "count": 2}, "100537": {"mean": 69.52, "std": 68.05, "count": 6}, "100538": {"mean": 95.01, "std": 46.72, "count": 3}, "100539": {"mean": 114.0, "std": 60.26, "count": 3}, "100541": {"mean": 98.81, "std": 56.06, "count": 6}, "100542": {"mean": 79.12, "std": 38.38, "count": 4}, "100543": {"mean": 63.15, "std": 37.79, "count": 3}, "100544": {"mean": 46.17, "std": 30.56, "count": 5}, "100546": {"mean": 66.68, "std": 35.02, "count": 5}, "100547": {"mean": 89.12, "std": 18.55, "count": 3}, "100548": {"mean": 87.26, "std": 68.53, "count": 4}, "100549": {"mean": 80.09, "std": 88.25, "count": 4}, "100550": {"mean": 90.93, "std": 36.71, "count": 4}, "100551": {"mean": 83.95, "std": 35.16, "count": 3}, "100552": {"mean": 92.87, "std": 51.68, "count": 6}, "100553": {"mean": 66.29, "std": 36.3, "count": 6}, "100554": {"mean": 72.81, "std": 23.08, "count": 3}, "100555": {"mean": 88.41, "std": 32.4, "count": 6}, "100556": {"mean": 94.1, "std": 49.33, "count": 5}, "100557": {"mean": 63.34, "std": 31.79, "count": 2}, "100558": {"mean": 115.52, "std": 73.34, "count": 5}, "100559": {"mean": 77.27, "std": 32.53, "count": 7}, "100560": {"mean": 50.59, "std": 33.28, "count": 4}, "100561": {"mean": 99.42, "std": 44.37, "count": 5}, "100562": {"mean": 71.73, "std": 49.51, "count": 8}, "100563": {"mean": 77.01, "std": 25.74, "count": 3}, "100564": {"mean": 74.65, "std": 34.64, "count": 9}, "100565": {"mean": 73.25, "std": 10, "count": 2}, "100566": {"mean": 75.92, "std": 58.96, "count": 6}, "100567": {"mean": 133.31, "std": 64.5, "count": 2}, "100568": {"mean": 76.44, "std": 30.93, "count": 5}, "100569": {"mean": 86.02, "std": 28.07, "count": 5}, "100571": {"mean": 69.3, "std": 25.67, "count": 8}, "100572": {"mean": 43.11, "std": 19.49, "count": 4}, "100573": {"mean": 96.37, "std": 38.24, "count": 4}, "100574": {"mean": 51.1, "std": 10, "count": 2}, "100575": {"mean": 228.32, "std": 50, "count": 1}, "100576": {"mean": 428.13, "std": 392.02, "count": 2}, "100577": {"mean": 82.22, "std": 39.4, "count": 8}, "100578": {"mean": 100.26, "std": 67.34, "count": 8}, "100579": {"mean": 46.56, "std": 26.24, "count": 5}, "100580": {"mean": 106.53, "std": 88.52, "count": 4}, "100581": {"mean": 32.13, "std": 23.92, "count": 5}, "100582": {"mean": 42.27, "std": 14.45, "count": 3}, "100583": {"mean": 21.31, "std": 10, "count": 2}, "100584": {"mean": 69.0, "std": 29.19, "count": 6}, "100585": {"mean": 65.9, "std": 32.94, "count": 4}, "100586": {"mean": 54.32, "std": 34.74, "count": 2}, "100587": {"mean": 87.48, "std": 57.82, "count": 5}, "100589": {"mean": 104.55, "std": 25.09, "count": 4}, "100590": {"mean": 114.29, "std": 19.91, "count": 3}, "100591": {"mean": 39.11, "std": 50, "count": 1}, "100592": {"mean": 61.3, "std": 22.77, "count": 5}, "100593": {"mean": 122.09, "std": 25.61, "count": 4}, "100594": {"mean": 81.67, "std": 75.67, "count": 3}, "100596": {"mean": 84.57, "std": 49.21, "count": 2}, "100597": {"mean": 40.9, "std": 10, "count": 5}, "100599": {"mean": 41.49, "std": 17.86, "count": 5}, "100600": {"mean": 64.07, "std": 20.29, "count": 3}, "100601": {"mean": 94.19, "std": 55.61, "count": 6}, "100602": {"mean": 48.39, "std": 29.53, "count": 2}, "100603": {"mean": 46.63, "std": 30.87, "count": 5}, "100604": {"mean": 108.29, "std": 73.5, "count": 6}, "100605": {"mean": 79.25, "std": 26.61, "count": 6}, "100606": {"mean": 77.51, "std": 29.62, "count": 7}, "100607": {"mean": 100.97, "std": 27.32, "count": 2}, "100608": {"mean": 94.9, "std": 88.39, "count": 5}, "100609": {"mean": 69.95, "std": 10.11, "count": 7}, "100610": {"mean": 54.76, "std": 56.43, "count": 6}, "100611": {"mean": 65.99, "std": 30.91, "count": 3}, "100612": {"mean": 37.77, "std": 24.69, "count": 8}, "100613": {"mean": 61.54, "std": 19.42, "count": 7}, "100614": {"mean": 81.83, "std": 58.77, "count": 7}, "100615": {"mean": 86.41, "std": 37.88, "count": 5}, "100616": {"mean": 60.91, "std": 28.59, "count": 3}, "100617": {"mean": 95.11, "std": 46.72, "count": 5}, "100618": {"mean": 83.27, "std": 57.94, "count": 7}, "100619": {"mean": 81.17, "std": 49.48, "count": 4}, "100620": {"mean": 91.11, "std": 33.69, "count": 5}, "100621": {"mean": 188.06, "std": 28.81, "count": 3}, "100622": {"mean": 102.24, "std": 56.35, "count": 6}, "100623": {"mean": 81.29, "std": 26.26, "count": 2}, "100624": {"mean": 26.44, "std": 50, "count": 1}, "100626": {"mean": 504.29, "std": 444.92, "count": 3}, "100627": {"mean": 98.48, "std": 22.59, "count": 5}, "100628": {"mean": 63.72, "std": 32.44, "count": 4}, "100629": {"mean": 96.44, "std": 32.72, "count": 3}, "100630": {"mean": 67.09, "std": 50.73, "count": 6}, "100631": {"mean": 88.83, "std": 60.73, "count": 6}, "100632": {"mean": 70.57, "std": 50, "count": 1}, "100633": {"mean": 66.48, "std": 22.62, "count": 4}, "100634": {"mean": 30.55, "std": 50, "count": 1}, "100635": {"mean": 49.83, "std": 19.73, "count": 7}, "100636": {"mean": 40.11, "std": 10, "count": 2}, "100637": {"mean": 46.43, "std": 10.41, "count": 3}, "100638": {"mean": 72.72, "std": 54.25, "count": 5}, "100639": {"mean": 106.74, "std": 105.96, "count": 6}, "100640": {"mean": 58.87, "std": 12.07, "count": 4}, "100641": {"mean": 60.18, "std": 44.34, "count": 5}, "100642": {"mean": 62.42, "std": 44.49, "count": 6}, "100643": {"mean": 102.62, "std": 28.84, "count": 4}, "100644": {"mean": 19.46, "std": 14.4, "count": 2}, "100645": {"mean": 46.1, "std": 33.89, "count": 5}, "100646": {"mean": 412.03, "std": 783.9, "count": 7}, "100647": {"mean": 69.51, "std": 67.9, "count": 4}, "100648": {"mean": 61.16, "std": 22.42, "count": 6}, "100649": {"mean": 71.86, "std": 45.16, "count": 7}, "100650": {"mean": 71.85, "std": 45.17, "count": 7}, "100651": {"mean": 88.25, "std": 15.91, "count": 5}, "100652": {"mean": 121.74, "std": 89.69, "count": 4}, "100653": {"mean": 41.61, "std": 27.7, "count": 6}, "100654": {"mean": 161.22, "std": 50, "count": 1}, "100655": {"mean": 99.83, "std": 55.74, "count": 5}, "100656": {"mean": 91.5, "std": 49.66, "count": 6}, "100657": {"mean": 89.25, "std": 18.13, "count": 5}, "100658": {"mean": 58.68, "std": 26.51, "count": 6}, "100659": {"mean": 57.33, "std": 39.52, "count": 4}, "100660": {"mean": 72.34, "std": 40.92, "count": 5}, "100661": {"mean": 187.42, "std": 168.42, "count": 3}, "100662": {"mean": 87.0, "std": 50.33, "count": 8}, "100663": {"mean": 93.26, "std": 53.69, "count": 4}, "100664": {"mean": 54.5, "std": 33.7, "count": 4}, "100665": {"mean": 84.86, "std": 50, "count": 1}, "100666": {"mean": 39.98, "std": 50, "count": 1}, "100667": {"mean": 83.08, "std": 10, "count": 2}, "100668": {"mean": 54.31, "std": 10.4, "count": 4}, "100669": {"mean": 90.48, "std": 32.28, "count": 6}, "100670": {"mean": 86.51, "std": 58.66, "count": 7}, "100671": {"mean": 128.11, "std": 72.21, "count": 11}, "100672": {"mean": 50.43, "std": 50, "count": 1}, "100673": {"mean": 86.68, "std": 77.63, "count": 3}, "100674": {"mean": 244.22, "std": 50, "count": 1}, "100675": {"mean": 35.26, "std": 15.87, "count": 3}, "100676": {"mean": 47.89, "std": 48.81, "count": 5}, "100677": {"mean": 642.23, "std": 852.36, "count": 4}, "100678": {"mean": 87.64, "std": 40.81, "count": 6}, "100679": {"mean": 43.28, "std": 24.21, "count": 3}, "100681": {"mean": 77.19, "std": 52.0, "count": 4}, "100682": {"mean": 74.28, "std": 34.32, "count": 4}, "100683": {"mean": 91.05, "std": 64.77, "count": 5}, "100684": {"mean": 65.37, "std": 40.97, "count": 7}, "100685": {"mean": 96.94, "std": 67.93, "count": 4}, "100686": {"mean": 125.19, "std": 26.8, "count": 3}, "100687": {"mean": 43.44, "std": 29.1, "count": 3}, "100688": {"mean": 90.21, "std": 54.82, "count": 8}, "100689": {"mean": 85.51, "std": 58.09, "count": 7}, "100690": {"mean": 55.12, "std": 39.81, "count": 2}, "100691": {"mean": 74.4, "std": 40.93, "count": 5}, "100692": {"mean": 68.82, "std": 37.15, "count": 8}, "100693": {"mean": 54.13, "std": 23.37, "count": 5}, "100694": {"mean": 67.12, "std": 44.97, "count": 3}, "100695": {"mean": 141.99, "std": 89.88, "count": 8}, "100696": {"mean": 45.99, "std": 31.79, "count": 11}, "100697": {"mean": 55.11, "std": 32.65, "count": 7}, "100698": {"mean": 126.2, "std": 135.32, "count": 3}, "100699": {"mean": 19.98, "std": 10, "count": 2}, "100700": {"mean": 70.66, "std": 39.26, "count": 5}, "100701": {"mean": 112.82, "std": 57.56, "count": 5}, "100702": {"mean": 94.64, "std": 61.33, "count": 4}, "100703": {"mean": 89.63, "std": 28.64, "count": 4}, "100704": {"mean": 58.04, "std": 29.79, "count": 4}, "100705": {"mean": 26.39, "std": 13.52, "count": 3}, "100706": {"mean": 140.09, "std": 46.42, "count": 3}, "100707": {"mean": 72.98, "std": 30.23, "count": 8}, "100708": {"mean": 68.19, "std": 58.17, "count": 4}, "100709": {"mean": 142.73, "std": 94.47, "count": 7}, "100710": {"mean": 104.63, "std": 49.22, "count": 5}, "100711": {"mean": 32.95, "std": 19.07, "count": 3}, "100712": {"mean": 85.14, "std": 78.36, "count": 6}, "100713": {"mean": 125.36, "std": 76.55, "count": 7}, "100714": {"mean": 111.48, "std": 62.23, "count": 4}, "100715": {"mean": 101.34, "std": 57.63, "count": 5}, "100716": {"mean": 146.84, "std": 10.62, "count": 2}, "100717": {"mean": 41.7, "std": 24.27, "count": 2}, "100718": {"mean": 48.38, "std": 33.36, "count": 5}, "100719": {"mean": 86.47, "std": 68.39, "count": 3}, "100720": {"mean": 79.99, "std": 31.82, "count": 3}, "100721": {"mean": 92.48, "std": 61.62, "count": 5}, "100722": {"mean": 65.51, "std": 28.66, "count": 7}, "100723": {"mean": 93.51, "std": 51.05, "count": 8}, "100724": {"mean": 82.82, "std": 37.12, "count": 5}, "100725": {"mean": 59.79, "std": 24.08, "count": 4}, "100726": {"mean": 51.5, "std": 31.19, "count": 5}, "100727": {"mean": 50.93, "std": 27.36, "count": 5}, "100728": {"mean": 76.17, "std": 31.92, "count": 5}, "100730": {"mean": 86.64, "std": 15.88, "count": 2}, "100731": {"mean": 106.0, "std": 30.93, "count": 6}, "100732": {"mean": 51.76, "std": 46.82, "count": 3}, "100733": {"mean": 22.14, "std": 10, "count": 2}, "100734": {"mean": 47.52, "std": 36.25, "count": 6}, "100735": {"mean": 69.54, "std": 32.42, "count": 7}, "100736": {"mean": 48.59, "std": 46.28, "count": 5}, "100737": {"mean": 88.4, "std": 40.39, "count": 3}, "100738": {"mean": 55.32, "std": 30.57, "count": 10}, "100739": {"mean": 76.01, "std": 56.8, "count": 3}, "100740": {"mean": 54.22, "std": 25.91, "count": 5}, "100741": {"mean": 51.95, "std": 28.93, "count": 4}, "100742": {"mean": 50.67, "std": 48.83, "count": 5}, "100743": {"mean": 122.32, "std": 125.26, "count": 3}, "100744": {"mean": 57.14, "std": 23.07, "count": 3}, "100745": {"mean": 83.34, "std": 10, "count": 2}, "100746": {"mean": 120.64, "std": 89.02, "count": 7}, "100747": {"mean": 87.32, "std": 64.62, "count": 5}, "100748": {"mean": 69.71, "std": 36.76, "count": 5}, "100749": {"mean": 80.05, "std": 30.93, "count": 3}, "100750": {"mean": 75.61, "std": 22.2, "count": 5}, "100751": {"mean": 63.93, "std": 24.32, "count": 3}, "100752": {"mean": 70.18, "std": 44.21, "count": 3}, "100753": {"mean": 79.42, "std": 44.53, "count": 8}, "100754": {"mean": 35.48, "std": 27.59, "count": 2}, "100755": {"mean": 50.88, "std": 14.39, "count": 3}, "100756": {"mean": 38.33, "std": 10.88, "count": 2}, "100757": {"mean": 50.54, "std": 33.36, "count": 5}, "100759": {"mean": 43.76, "std": 32.41, "count": 2}, "100760": {"mean": 58.58, "std": 33.81, "count": 8}, "100761": {"mean": 131.78, "std": 75.32, "count": 5}, "100762": {"mean": 72.84, "std": 10, "count": 2}, "100763": {"mean": 105.3, "std": 54.69, "count": 3}, "100764": {"mean": 158.45, "std": 262.82, "count": 9}, "100765": {"mean": 68.4, "std": 42.11, "count": 6}, "100766": {"mean": 115.76, "std": 45.61, "count": 2}, "100767": {"mean": 84.36, "std": 50, "count": 1}, "100769": {"mean": 55.15, "std": 50, "count": 1}, "100770": {"mean": 98.11, "std": 37.4, "count": 3}, "100771": {"mean": 140.03, "std": 107.25, "count": 2}, "100772": {"mean": 26.29, "std": 14.84, "count": 2}, "100773": {"mean": 85.42, "std": 94.33, "count": 5}, "100774": {"mean": 65.47, "std": 27.26, "count": 6}, "100775": {"mean": 60.09, "std": 52.26, "count": 3}, "100776": {"mean": 106.17, "std": 56.83, "count": 5}, "100777": {"mean": 54.8, "std": 32.06, "count": 3}, "100778": {"mean": 57.43, "std": 34.81, "count": 5}, "100779": {"mean": 128.53, "std": 70.21, "count": 3}, "100780": {"mean": 54.24, "std": 48.85, "count": 5}, "100781": {"mean": 88.03, "std": 54.43, "count": 8}, "100782": {"mean": 71.87, "std": 28.82, "count": 3}, "100783": {"mean": 79.16, "std": 49.28, "count": 3}, "100784": {"mean": 114.85, "std": 62.63, "count": 3}, "100785": {"mean": 79.56, "std": 16.7, "count": 2}, "100786": {"mean": 107.23, "std": 10, "count": 2}, "100787": {"mean": 67.3, "std": 34.17, "count": 3}, "100788": {"mean": 94.95, "std": 47.02, "count": 7}, "100789": {"mean": 80.17, "std": 36.87, "count": 3}, "100790": {"mean": 74.67, "std": 22.52, "count": 5}, "100791": {"mean": 85.4, "std": 52.81, "count": 6}, "100793": {"mean": 153.1, "std": 113.05, "count": 4}, "100794": {"mean": 48.99, "std": 25.4, "count": 5}, "100795": {"mean": 73.81, "std": 52.27, "count": 8}, "100796": {"mean": 74.27, "std": 10, "count": 2}, "100797": {"mean": 90.51, "std": 79.21, "count": 8}, "100798": {"mean": 17.16, "std": 50, "count": 1}, "100799": {"mean": 83.89, "std": 53.96, "count": 4}, "100800": {"mean": 431.09, "std": 631.24, "count": 4}, "100801": {"mean": 179.37, "std": 146.5, "count": 4}, "100802": {"mean": 73.03, "std": 44.66, "count": 7}, "100803": {"mean": 53.23, "std": 26.03, "count": 7}, "100804": {"mean": 70.27, "std": 27.9, "count": 4}, "100805": {"mean": 106.71, "std": 49.68, "count": 4}, "100806": {"mean": 104.26, "std": 50, "count": 1}, "100807": {"mean": 66.38, "std": 41.69, "count": 5}, "100808": {"mean": 71.31, "std": 25.43, "count": 6}, "100809": {"mean": 75.44, "std": 51.44, "count": 7}, "100810": {"mean": 119.27, "std": 54.59, "count": 4}, "100811": {"mean": 45.91, "std": 16.43, "count": 4}, "100812": {"mean": 93.89, "std": 15.76, "count": 4}, "100813": {"mean": 70.42, "std": 51.89, "count": 4}, "100814": {"mean": 52.07, "std": 37.6, "count": 6}, "100815": {"mean": 34.16, "std": 12.22, "count": 3}, "100816": {"mean": 60.56, "std": 10, "count": 2}, "100817": {"mean": 29.23, "std": 18.35, "count": 3}, "100818": {"mean": 103.8, "std": 11.94, "count": 4}, "100819": {"mean": 58.39, "std": 34.93, "count": 8}, "100820": {"mean": 95.35, "std": 61.48, "count": 4}, "100821": {"mean": 73.35, "std": 32.4, "count": 3}, "100822": {"mean": 95.35, "std": 52.3, "count": 3}, "100823": {"mean": 81.5, "std": 25.64, "count": 4}, "100824": {"mean": 227.8, "std": 121.41, "count": 3}, "100825": {"mean": 96.56, "std": 10, "count": 2}, "100826": {"mean": 86.47, "std": 57.65, "count": 6}, "100827": {"mean": 68.8, "std": 66.99, "count": 9}, "100828": {"mean": 82.21, "std": 70.85, "count": 5}, "100829": {"mean": 66.74, "std": 55.92, "count": 3}, "100830": {"mean": 313.37, "std": 425.68, "count": 4}, "100831": {"mean": 68.11, "std": 10.92, "count": 5}, "100832": {"mean": 91.03, "std": 50, "count": 1}, "100833": {"mean": 64.3, "std": 49.25, "count": 5}, "100834": {"mean": 83.74, "std": 41.35, "count": 4}, "100835": {"mean": 117.98, "std": 25.73, "count": 3}, "100836": {"mean": 52.72, "std": 14.14, "count": 3}, "100837": {"mean": 381.77, "std": 363.88, "count": 3}, "100838": {"mean": 93.02, "std": 40.23, "count": 4}, "100839": {"mean": 83.34, "std": 23.64, "count": 5}, "100840": {"mean": 497.35, "std": 806.6, "count": 4}, "100841": {"mean": 49.59, "std": 40.22, "count": 5}, "100842": {"mean": 84.08, "std": 17.77, "count": 3}, "100843": {"mean": 75.86, "std": 32.32, "count": 2}, "100844": {"mean": 62.95, "std": 53.18, "count": 3}, "100845": {"mean": 110.78, "std": 90.87, "count": 4}, "100846": {"mean": 78.73, "std": 52.36, "count": 6}, "100847": {"mean": 67.2, "std": 41.34, "count": 6}, "100848": {"mean": 49.25, "std": 18.75, "count": 3}, "100849": {"mean": 23.98, "std": 10, "count": 2}, "100850": {"mean": 92.0, "std": 40.08, "count": 9}, "100851": {"mean": 99.76, "std": 53.53, "count": 6}, "100852": {"mean": 85.32, "std": 51.38, "count": 5}, "100853": {"mean": 112.32, "std": 60.76, "count": 5}, "100854": {"mean": 57.69, "std": 23.77, "count": 4}, "100855": {"mean": 67.98, "std": 59.37, "count": 6}, "100856": {"mean": 96.69, "std": 63.83, "count": 6}, "100857": {"mean": 91.35, "std": 40.48, "count": 4}, "100858": {"mean": 115.26, "std": 43.48, "count": 4}, "100859": {"mean": 98.72, "std": 56.26, "count": 6}, "100860": {"mean": 72.22, "std": 21.18, "count": 4}, "100861": {"mean": 28.49, "std": 19.09, "count": 2}, "100862": {"mean": 18.1, "std": 50, "count": 1}, "100863": {"mean": 53.3, "std": 24.86, "count": 2}, "100864": {"mean": 83.67, "std": 43.59, "count": 2}, "100865": {"mean": 95.87, "std": 43.28, "count": 4}, "100866": {"mean": 15.94, "std": 14.29, "count": 3}, "100867": {"mean": 64.62, "std": 31.18, "count": 6}, "100868": {"mean": 82.53, "std": 32.01, "count": 6}, "100869": {"mean": 39.57, "std": 17.99, "count": 3}, "100870": {"mean": 110.12, "std": 97.24, "count": 3}, "100871": {"mean": 69.82, "std": 42.04, "count": 6}, "100872": {"mean": 43.5, "std": 10, "count": 2}, "100873": {"mean": 40.57, "std": 23.39, "count": 4}, "100874": {"mean": 64.32, "std": 10, "count": 3}, "100875": {"mean": 81.68, "std": 86.78, "count": 4}, "100876": {"mean": 51.98, "std": 18.22, "count": 4}, "100877": {"mean": 103.09, "std": 80.96, "count": 8}, "100878": {"mean": 62.44, "std": 25.8, "count": 4}, "100879": {"mean": 70.94, "std": 10, "count": 2}, "100880": {"mean": 71.69, "std": 23.41, "count": 3}, "100881": {"mean": 61.42, "std": 37.54, "count": 2}, "100882": {"mean": 130.44, "std": 86.31, "count": 8}, "100883": {"mean": 76.1, "std": 46.55, "count": 3}, "100884": {"mean": 77.83, "std": 30.92, "count": 4}, "100885": {"mean": 89.91, "std": 89.28, "count": 4}, "100886": {"mean": 77.81, "std": 50.95, "count": 3}, "100887": {"mean": 104.2, "std": 86.27, "count": 4}, "100888": {"mean": 57.72, "std": 10, "count": 2}, "100889": {"mean": 61.49, "std": 50, "count": 1}, "100890": {"mean": 86.42, "std": 70.5, "count": 6}, "100891": {"mean": 80.41, "std": 19.12, "count": 2}, "100892": {"mean": 39.02, "std": 23.58, "count": 7}, "100893": {"mean": 54.55, "std": 27.17, "count": 5}, "100894": {"mean": 65.0, "std": 26.36, "count": 3}, "100895": {"mean": 95.75, "std": 43.58, "count": 3}, "100896": {"mean": 71.68, "std": 14.34, "count": 3}, "100897": {"mean": 75.75, "std": 25.18, "count": 4}, "100898": {"mean": 97.81, "std": 89.39, "count": 3}, "100899": {"mean": 56.06, "std": 55.03, "count": 5}, "100900": {"mean": 52.17, "std": 35.05, "count": 8}, "100901": {"mean": 54.22, "std": 10, "count": 2}, "100902": {"mean": 67.72, "std": 21.18, "count": 2}, "100903": {"mean": 94.35, "std": 76.83, "count": 7}, "100904": {"mean": 89.52, "std": 50.45, "count": 5}, "100905": {"mean": 47.92, "std": 30.28, "count": 4}, "100906": {"mean": 86.58, "std": 44.91, "count": 4}, "100907": {"mean": 181.84, "std": 106.24, "count": 2}, "100908": {"mean": 135.22, "std": 47.74, "count": 4}, "100909": {"mean": 86.77, "std": 37.23, "count": 6}, "100910": {"mean": 43.48, "std": 20.97, "count": 3}, "100911": {"mean": 52.77, "std": 19.95, "count": 6}, "100912": {"mean": 571.07, "std": 895.66, "count": 4}, "100913": {"mean": 8.97, "std": 50, "count": 1}, "100914": {"mean": 95.71, "std": 42.7, "count": 2}, "100915": {"mean": 81.7, "std": 50, "count": 1}, "100916": {"mean": 64.2, "std": 28.14, "count": 6}, "100917": {"mean": 71.74, "std": 24.75, "count": 4}, "100918": {"mean": 98.1, "std": 21.16, "count": 3}, "100919": {"mean": 61.3, "std": 28.51, "count": 3}, "100920": {"mean": 74.89, "std": 47.87, "count": 5}, "100921": {"mean": 78.31, "std": 61.15, "count": 3}, "100922": {"mean": 14.68, "std": 10, "count": 3}, "100923": {"mean": 40.53, "std": 10.28, "count": 4}, "100924": {"mean": 62.15, "std": 54.25, "count": 5}, "100925": {"mean": 150.16, "std": 84.45, "count": 5}, "100926": {"mean": 60.99, "std": 41.07, "count": 6}, "100927": {"mean": 122.14, "std": 70.7, "count": 7}, "100928": {"mean": 57.8, "std": 26.62, "count": 3}, "100929": {"mean": 109.33, "std": 68.69, "count": 3}, "100930": {"mean": 82.18, "std": 34.67, "count": 5}, "100931": {"mean": 36.21, "std": 10, "count": 3}, "100932": {"mean": 73.03, "std": 54.38, "count": 2}, "100933": {"mean": 56.61, "std": 28.59, "count": 5}, "100934": {"mean": 67.09, "std": 28.46, "count": 6}, "100935": {"mean": 112.67, "std": 19.06, "count": 3}, "100936": {"mean": 69.06, "std": 84.27, "count": 3}, "100937": {"mean": 68.45, "std": 28.99, "count": 6}, "100938": {"mean": 55.78, "std": 50, "count": 1}, "100939": {"mean": 72.33, "std": 50.25, "count": 6}, "100940": {"mean": 139.94, "std": 64.44, "count": 4}, "100941": {"mean": 72.93, "std": 20.71, "count": 3}, "100943": {"mean": 50.59, "std": 29.86, "count": 5}, "100944": {"mean": 47.06, "std": 26.89, "count": 6}, "100945": {"mean": 98.07, "std": 34.61, "count": 6}, "100946": {"mean": 39.35, "std": 16.43, "count": 5}, "100947": {"mean": 78.56, "std": 36.91, "count": 6}, "100948": {"mean": 42.42, "std": 19.22, "count": 4}, "100949": {"mean": 54.71, "std": 39.25, "count": 4}, "100950": {"mean": 112.33, "std": 42.89, "count": 2}, "100951": {"mean": 86.64, "std": 77.8, "count": 8}, "100952": {"mean": 108.59, "std": 50, "count": 1}, "100953": {"mean": 81.96, "std": 50.06, "count": 11}, "100954": {"mean": 110.96, "std": 63.69, "count": 5}, "100955": {"mean": 46.75, "std": 22.36, "count": 3}, "100956": {"mean": 83.07, "std": 51.19, "count": 5}, "100957": {"mean": 82.72, "std": 33.06, "count": 6}, "100958": {"mean": 64.04, "std": 38.72, "count": 3}, "100959": {"mean": 79.56, "std": 69.81, "count": 3}, "100960": {"mean": 74.65, "std": 36.49, "count": 3}, "100961": {"mean": 31.57, "std": 10, "count": 2}, "100962": {"mean": 63.53, "std": 33.85, "count": 3}, "100963": {"mean": 51.8, "std": 35.51, "count": 3}, "100964": {"mean": 129.12, "std": 93.31, "count": 5}, "100965": {"mean": 94.16, "std": 37.77, "count": 5}, "100966": {"mean": 33.19, "std": 14.76, "count": 4}, "100967": {"mean": 63.41, "std": 26.59, "count": 7}, "100968": {"mean": 91.56, "std": 44.06, "count": 6}, "100969": {"mean": 63.41, "std": 28.42, "count": 5}, "100970": {"mean": 41.21, "std": 24.21, "count": 3}, "100971": {"mean": 61.5, "std": 33.52, "count": 7}, "100972": {"mean": 92.92, "std": 31.49, "count": 8}, "100973": {"mean": 51.09, "std": 47.05, "count": 7}, "100974": {"mean": 92.3, "std": 31.54, "count": 5}, "100975": {"mean": 114.43, "std": 41.86, "count": 3}, "100976": {"mean": 80.53, "std": 49.39, "count": 6}, "100977": {"mean": 76.72, "std": 31.04, "count": 4}, "100978": {"mean": 30.8, "std": 10, "count": 3}, "100979": {"mean": 82.02, "std": 21.35, "count": 3}, "100980": {"mean": 113.29, "std": 11.84, "count": 2}, "100981": {"mean": 70.77, "std": 35.24, "count": 4}, "100982": {"mean": 76.61, "std": 10.86, "count": 2}, "100983": {"mean": 125.97, "std": 13.9, "count": 2}, "100984": {"mean": 81.1, "std": 92.48, "count": 6}, "100985": {"mean": 68.74, "std": 37.37, "count": 3}, "100986": {"mean": 54.69, "std": 38.43, "count": 7}, "100987": {"mean": 37.44, "std": 13.81, "count": 3}, "100988": {"mean": 53.45, "std": 17.36, "count": 2}, "100989": {"mean": 108.0, "std": 10, "count": 2}, "100990": {"mean": 128.44, "std": 26.87, "count": 4}, "100991": {"mean": 49.51, "std": 41.59, "count": 2}, "100992": {"mean": 139.93, "std": 40.77, "count": 2}, "100993": {"mean": 79.68, "std": 21.98, "count": 2}, "100994": {"mean": 72.7, "std": 12.65, "count": 4}, "100995": {"mean": 99.86, "std": 42.47, "count": 11}, "100997": {"mean": 78.83, "std": 69.44, "count": 4}, "100998": {"mean": 142.08, "std": 73.44, "count": 5}, "100999": {"mean": 64.31, "std": 48.08, "count": 5}, "101000": {"mean": 15.71, "std": 10, "count": 3}, "101001": {"mean": 78.44, "std": 30.07, "count": 4}, "101002": {"mean": 111.86, "std": 74.11, "count": 5}, "101003": {"mean": 87.52, "std": 60.99, "count": 8}, "101004": {"mean": 95.11, "std": 10, "count": 3}, "101005": {"mean": 71.66, "std": 26.73, "count": 4}, "101006": {"mean": 92.86, "std": 47.27, "count": 9}, "101007": {"mean": 60.52, "std": 40.82, "count": 5}, "101008": {"mean": 64.41, "std": 42.03, "count": 4}, "101009": {"mean": 67.23, "std": 44.32, "count": 3}, "101010": {"mean": 131.34, "std": 50, "count": 1}, "101011": {"mean": 82.78, "std": 50.39, "count": 6}, "101012": {"mean": 57.47, "std": 38.43, "count": 5}, "101013": {"mean": 101.77, "std": 112.41, "count": 5}, "101014": {"mean": 105.41, "std": 15.0, "count": 3}, "101015": {"mean": 119.17, "std": 88.61, "count": 5}, "101016": {"mean": 66.45, "std": 65.71, "count": 3}, "101018": {"mean": 84.37, "std": 45.59, "count": 6}, "101019": {"mean": 45.83, "std": 27.51, "count": 2}, "101020": {"mean": 64.18, "std": 37.44, "count": 3}, "101021": {"mean": 58.0, "std": 50, "count": 1}, "101022": {"mean": 96.6, "std": 50.48, "count": 6}, "101023": {"mean": 116.84, "std": 84.0, "count": 2}, "101024": {"mean": 74.37, "std": 55.36, "count": 3}, "101025": {"mean": 110.41, "std": 50, "count": 1}, "101026": {"mean": 89.46, "std": 50.44, "count": 4}, "101027": {"mean": 23.41, "std": 16.17, "count": 3}, "101028": {"mean": 123.36, "std": 71.36, "count": 6}, "101029": {"mean": 98.08, "std": 69.08, "count": 2}, "101030": {"mean": 71.98, "std": 15.48, "count": 4}, "101031": {"mean": 77.39, "std": 52.56, "count": 5}, "101032": {"mean": 54.44, "std": 26.92, "count": 3}, "101033": {"mean": 92.21, "std": 12.1, "count": 3}, "101034": {"mean": 75.76, "std": 56.26, "count": 8}, "101035": {"mean": 40.02, "std": 50, "count": 1}, "101036": {"mean": 63.2, "std": 38.17, "count": 8}, "101037": {"mean": 42.8, "std": 17.5, "count": 4}, "101038": {"mean": 68.55, "std": 13.69, "count": 2}, "101039": {"mean": 71.66, "std": 13.99, "count": 7}, "101040": {"mean": 21.31, "std": 14.32, "count": 2}, "101041": {"mean": 93.54, "std": 10, "count": 2}, "101042": {"mean": 124.43, "std": 60.89, "count": 3}, "101043": {"mean": 120.06, "std": 116.22, "count": 5}, "101044": {"mean": 85.28, "std": 38.39, "count": 6}, "101045": {"mean": 89.54, "std": 39.75, "count": 3}, "101046": {"mean": 72.12, "std": 32.58, "count": 8}, "101047": {"mean": 54.62, "std": 11.74, "count": 3}, "101048": {"mean": 69.66, "std": 38.33, "count": 2}, "101049": {"mean": 74.27, "std": 34.99, "count": 4}, "101050": {"mean": 60.36, "std": 23.4, "count": 2}, "101051": {"mean": 110.21, "std": 85.8, "count": 5}, "101052": {"mean": 102.13, "std": 89.81, "count": 2}, "101053": {"mean": 53.08, "std": 50, "count": 1}, "101054": {"mean": 97.04, "std": 77.6, "count": 9}, "101055": {"mean": 80.52, "std": 53.62, "count": 5}, "101057": {"mean": 38.33, "std": 10, "count": 3}, "101058": {"mean": 42.26, "std": 24.09, "count": 9}, "101059": {"mean": 109.32, "std": 28.26, "count": 4}, "101060": {"mean": 75.77, "std": 46.83, "count": 6}, "101061": {"mean": 79.55, "std": 38.17, "count": 6}, "101062": {"mean": 78.24, "std": 60.73, "count": 9}, "101063": {"mean": 114.67, "std": 40.8, "count": 4}, "101064": {"mean": 78.65, "std": 47.46, "count": 5}, "101065": {"mean": 79.39, "std": 58.62, "count": 6}, "101066": {"mean": 76.27, "std": 39.44, "count": 6}, "101067": {"mean": 121.39, "std": 82.93, "count": 4}, "101068": {"mean": 72.62, "std": 20.41, "count": 3}, "101069": {"mean": 99.92, "std": 74.34, "count": 9}, "101070": {"mean": 32.37, "std": 10, "count": 2}, "101071": {"mean": 79.71, "std": 42.73, "count": 5}, "101072": {"mean": 53.37, "std": 36.87, "count": 7}, "101073": {"mean": 93.24, "std": 34.23, "count": 5}, "101074": {"mean": 72.06, "std": 10, "count": 4}, "101075": {"mean": 80.76, "std": 80.46, "count": 6}, "101076": {"mean": 86.64, "std": 50.38, "count": 7}, "101077": {"mean": 52.64, "std": 41.65, "count": 8}, "101078": {"mean": 144.34, "std": 57.46, "count": 4}, "101079": {"mean": 93.82, "std": 14.0, "count": 2}, "101080": {"mean": 58.84, "std": 42.34, "count": 4}, "101081": {"mean": 77.62, "std": 61.82, "count": 4}, "101082": {"mean": 50.48, "std": 57.05, "count": 5}, "101083": {"mean": 67.92, "std": 40.97, "count": 6}, "101084": {"mean": 107.92, "std": 55.68, "count": 6}, "101085": {"mean": 70.47, "std": 42.09, "count": 5}, "101086": {"mean": 68.82, "std": 34.98, "count": 5}, "101087": {"mean": 62.99, "std": 34.47, "count": 5}, "101088": {"mean": 52.68, "std": 38.69, "count": 3}, "101089": {"mean": 84.84, "std": 37.76, "count": 2}, "101090": {"mean": 94.14, "std": 71.73, "count": 3}, "101091": {"mean": 107.17, "std": 69.5, "count": 5}, "101092": {"mean": 101.36, "std": 71.71, "count": 3}, "101093": {"mean": 87.19, "std": 51.39, "count": 3}, "101094": {"mean": 88.93, "std": 14.43, "count": 3}, "101095": {"mean": 167.13, "std": 95.75, "count": 3}, "101096": {"mean": 50.3, "std": 27.33, "count": 4}, "101097": {"mean": 70.44, "std": 50, "count": 1}, "101098": {"mean": 87.58, "std": 63.85, "count": 5}, "101099": {"mean": 90.36, "std": 62.86, "count": 2}, "101100": {"mean": 26.52, "std": 10, "count": 2}, "101101": {"mean": 63.39, "std": 13.09, "count": 4}, "101102": {"mean": 64.57, "std": 30.51, "count": 7}, "101103": {"mean": 75.21, "std": 51.56, "count": 3}, "101104": {"mean": 68.71, "std": 36.64, "count": 5}, "101105": {"mean": 26.04, "std": 10, "count": 3}, "101106": {"mean": 73.53, "std": 41.17, "count": 6}, "101107": {"mean": 106.81, "std": 42.72, "count": 5}, "101108": {"mean": 70.2, "std": 50, "count": 1}, "101109": {"mean": 35.54, "std": 10.17, "count": 3}, "101110": {"mean": 79.54, "std": 56.27, "count": 2}, "101111": {"mean": 98.38, "std": 27.76, "count": 4}, "101112": {"mean": 62.21, "std": 31.98, "count": 7}, "101113": {"mean": 83.4, "std": 36.74, "count": 7}, "101114": {"mean": 94.85, "std": 58.94, "count": 4}, "101115": {"mean": 64.94, "std": 42.05, "count": 2}, "101116": {"mean": 76.62, "std": 44.21, "count": 5}, "101117": {"mean": 82.93, "std": 42.84, "count": 8}, "101118": {"mean": 46.44, "std": 24.74, "count": 3}, "101119": {"mean": 94.3, "std": 58.8, "count": 5}, "101120": {"mean": 87.5, "std": 12.9, "count": 3}, "101121": {"mean": 11.91, "std": 50, "count": 1}, "101122": {"mean": 60.09, "std": 36.81, "count": 10}, "101123": {"mean": 47.97, "std": 19.07, "count": 3}, "101124": {"mean": 64.14, "std": 43.43, "count": 3}, "101125": {"mean": 276.46, "std": 475.37, "count": 7}, "101126": {"mean": 44.85, "std": 33.48, "count": 6}, "101127": {"mean": 142.75, "std": 50, "count": 1}, "101128": {"mean": 78.45, "std": 35.92, "count": 6}, "101129": {"mean": 58.9, "std": 29.38, "count": 3}, "101130": {"mean": 77.6, "std": 46.21, "count": 7}, "101131": {"mean": 54.92, "std": 10, "count": 2}, "101132": {"mean": 18.37, "std": 50, "count": 1}, "101133": {"mean": 78.84, "std": 34.68, "count": 5}, "101134": {"mean": 86.72, "std": 44.92, "count": 10}, "101135": {"mean": 130.72, "std": 97.62, "count": 6}, "101136": {"mean": 114.56, "std": 15.47, "count": 2}, "101137": {"mean": 38.16, "std": 27.54, "count": 5}, "101138": {"mean": 77.76, "std": 46.65, "count": 7}, "101139": {"mean": 86.51, "std": 48.27, "count": 4}, "101140": {"mean": 16.29, "std": 13.09, "count": 2}, "101141": {"mean": 142.72, "std": 50.01, "count": 2}, "101142": {"mean": 103.84, "std": 72.81, "count": 6}, "101143": {"mean": 53.45, "std": 24.52, "count": 3}, "101144": {"mean": 117.73, "std": 50, "count": 1}, "101145": {"mean": 86.12, "std": 53.63, "count": 6}, "101146": {"mean": 89.74, "std": 26.33, "count": 4}, "101147": {"mean": 73.73, "std": 34.25, "count": 3}, "101148": {"mean": 93.65, "std": 78.04, "count": 3}, "101149": {"mean": 35.25, "std": 50, "count": 1}, "101150": {"mean": 80.61, "std": 31.72, "count": 4}, "101151": {"mean": 58.81, "std": 48.63, "count": 2}, "101152": {"mean": 37.88, "std": 23.71, "count": 3}, "101153": {"mean": 56.35, "std": 22.28, "count": 6}, "101154": {"mean": 91.66, "std": 91.45, "count": 5}, "101155": {"mean": 128.33, "std": 43.52, "count": 6}, "101156": {"mean": 72.9, "std": 21.44, "count": 3}, "101157": {"mean": 93.24, "std": 74.76, "count": 5}, "101158": {"mean": 107.08, "std": 77.74, "count": 7}, "101159": {"mean": 24.18, "std": 10, "count": 5}, "101160": {"mean": 88.85, "std": 35.4, "count": 5}, "101161": {"mean": 59.63, "std": 17.26, "count": 3}, "101162": {"mean": 46.44, "std": 11.35, "count": 5}, "101163": {"mean": 64.59, "std": 50, "count": 1}, "101164": {"mean": 72.79, "std": 50.94, "count": 8}, "101165": {"mean": 87.51, "std": 50, "count": 1}, "101166": {"mean": 57.78, "std": 29.37, "count": 9}, "101167": {"mean": 46.33, "std": 18.36, "count": 5}, "101168": {"mean": 154.9, "std": 13.53, "count": 2}, "101169": {"mean": 72.96, "std": 50, "count": 1}, "101170": {"mean": 72.36, "std": 27.42, "count": 5}, "101171": {"mean": 75.26, "std": 50, "count": 1}, "101172": {"mean": 90.22, "std": 54.17, "count": 3}, "101173": {"mean": 48.0, "std": 28.77, "count": 4}, "101174": {"mean": 32.75, "std": 16.71, "count": 2}, "101175": {"mean": 51.46, "std": 45.62, "count": 6}, "101176": {"mean": 82.55, "std": 23.95, "count": 3}, "101177": {"mean": 112.97, "std": 49.35, "count": 4}, "101178": {"mean": 64.83, "std": 45.63, "count": 5}, "101179": {"mean": 76.78, "std": 38.52, "count": 6}, "101180": {"mean": 62.73, "std": 18.07, "count": 5}, "101181": {"mean": 42.16, "std": 24.25, "count": 4}, "101182": {"mean": 77.71, "std": 35.67, "count": 8}, "101183": {"mean": 58.48, "std": 13.48, "count": 2}, "101184": {"mean": 87.16, "std": 46.87, "count": 6}, "101185": {"mean": 101.09, "std": 70.87, "count": 4}, "101186": {"mean": 51.84, "std": 50, "count": 1}, "101187": {"mean": 60.94, "std": 28.35, "count": 4}, "101188": {"mean": 60.84, "std": 27.68, "count": 2}, "101189": {"mean": 21.57, "std": 10, "count": 3}, "101190": {"mean": 57.03, "std": 25.49, "count": 3}, "101191": {"mean": 76.55, "std": 51.99, "count": 4}, "101192": {"mean": 74.94, "std": 57.04, "count": 5}, "101193": {"mean": 104.82, "std": 13.31, "count": 6}, "101194": {"mean": 48.56, "std": 21.61, "count": 4}, "101195": {"mean": 90.27, "std": 45.61, "count": 9}, "101196": {"mean": 86.62, "std": 44.86, "count": 8}, "101197": {"mean": 65.43, "std": 54.05, "count": 5}, "101198": {"mean": 84.34, "std": 61.64, "count": 4}, "101199": {"mean": 25.09, "std": 19.11, "count": 4}};

const INCOME_CATEGORIES = ["Less than $40K","$40K - $60K","$60K - $80K","$80K - $120K","$120K +"];
const EDUCATION_LEVELS  = ["Uneducated","High School","College","Graduate","Post-Graduate","Doctorate"];
const MARITAL_STATUSES  = ["Single","Married","Divorced","Unknown"];
const CARD_CATEGORIES   = ["Blue","Silver","Gold","Platinum"];
const PROVINCES = [
  { name:"British Columbia", lat:53.7267, lng:-127.6476 },
  { name:"Alberta",          lat:53.9333, lng:-116.5765 },
  { name:"Ontario",          lat:51.2538, lng:-85.3232  },
  { name:"Quebec",           lat:52.9399, lng:-73.5491  },
  { name:"Manitoba",         lat:53.7609, lng:-98.8139  },
];

// ─── Theme palettes ────────────────────────────────────────────────────────────


const THEMES = {
  logistic_regression: {
    bg:        "#070D1A",
    bgDeep:    "#040810",
    surface:   "#0D1525",
    surfaceHi: "#111D30",
    border:    "#1A2A45",
    borderHi:  "#243855",
    text:      "#E2EAF4",
    muted:     "#5A7499",
    mutedHi:   "#7A9CC4",
    accent:    "#3D8EF5",
    accentGlow:"rgba(61,142,245,0.18)",
    accentDim: "#1A4A8A",
    tag:       "#0A1220",
    tagBorder: "#152035",
    fraud:     "#F5604A",
    fraudBg:   "rgba(245,96,74,0.1)",
    fraudBdr:  "rgba(245,96,74,0.3)",
    safe:      "#4AC9A0",
    safeBg:    "rgba(74,201,160,0.1)",
    safeBdr:   "rgba(74,201,160,0.3)",
    amber:     "#F5B94A",
    amberBg:   "rgba(245,185,74,0.12)",
    name:      "Logistic Regression",
    label:     "LOGISTIC REGRESSION",
  },
  decision_tree: {
    bg:        "#060F0A",
    bgDeep:    "#030805",
    surface:   "#0A1810",
    surfaceHi: "#0F2016",
    border:    "#1A3525",
    borderHi:  "#234830",
    text:      "#DFF0E6",
    muted:     "#4E7A5E",
    mutedHi:   "#6EA080",
    accent:    "#3DC47A",
    accentGlow:"rgba(61,196,122,0.18)",
    accentDim: "#1A6A3A",
    tag:       "#071208",
    tagBorder: "#0F2214",
    fraud:     "#F5604A",
    fraudBg:   "rgba(245,96,74,0.1)",
    fraudBdr:  "rgba(245,96,74,0.3)",
    safe:      "#3DC47A",
    safeBg:    "rgba(61,196,122,0.1)",
    safeBdr:   "rgba(61,196,122,0.3)",
    amber:     "#F5C84A",
    amberBg:   "rgba(245,200,74,0.12)",
    name:      "Decision Tree",
    label:     "DECISION TREE",
  },
};

// ─── Mock model ───────────────────────────────────────────────────────────────
// Makes a transaction that scores as legitimate — safe amount band, daytime
function makeLegitTransaction() {
  const p = PROVINCES[Math.floor(Math.random()*PROVINCES.length)];
  const m = randFrom(MERCHANTS);
  const h = 7 + Math.floor(Math.random() * 14); // 07:00–20:00
  // Legit amounts cluster $20–$200 in the dataset
  const amt = parseFloat((15 + Math.random() * 115).toFixed(2)); // $15–$130, stays under spending spike threshold (~$171)
  const clientIds = Object.keys(CLIENT_STATS);
  const client_id = randFrom(clientIds);
  const lat = parseFloat((p.lat + (Math.random()-0.5)*0.5).toFixed(4));
  const lng = parseFloat((p.lng + (Math.random()-0.5)*0.5).toFixed(4));
  return {
    transaction_id:  "TXN_"+Math.floor(1000000+Math.random()*9000000),
    client_id,
    merchant:        m.name,
    business_type:   m.type,
    amt,
    date:            randDate(),
    time:            String(h).padStart(2,"0")+":"+String(Math.floor(Math.random()*60)).padStart(2,"0"),
    province:        p.name,
    lat, lng,
    nearest_city:    getNearestCity(lat, lng, p.name),
    income_category: randFrom(INCOME_CATEGORIES),
    education:       randFrom(EDUCATION_LEVELS),
    marital_status:  randFrom(MARITAL_STATUSES),
    card_category:   randFrom(CARD_CATEGORIES),
    months_on_book:  Math.floor(Math.random()*84)+12,
    birthday:        `${1950+Math.floor(Math.random()*45)}-${pad2(Math.floor(Math.random()*12)+1)}-${pad2(Math.floor(Math.random()*28)+1)}`,
  };
}

// Makes a transaction that scores as fraud — bimodal: probe OR large amount
function makeFraudTransaction() {
  const t = makeTransaction();
  // 40% chance: probe transaction (<$10), 60% chance: large amount (>$500)
  if (Math.random() < 0.4) {
    t.amt = parseFloat((1 + Math.random() * 8).toFixed(2)); // $1–$9 probe
  } else {
    t.amt = parseFloat((600 + Math.random() * 2000).toFixed(2)); // $600–$2600
  }
  return t;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad2    = n  => String(n).padStart(2,"0");
const randFrom= arr=> arr[Math.floor(Math.random()*arr.length)];
const randTime= () => `${pad2(Math.floor(Math.random()*24))}:${pad2(Math.floor(Math.random()*60))}`;
const randAmt = () => parseFloat((Math.random()*950+5).toFixed(2));
const randDate= () => `2026-0${Math.floor(Math.random()*9)+1}-${pad2(Math.floor(Math.random()*28)+1)}`;

function makeTransaction() {
  const m = randFrom(MERCHANTS), p = randFrom(PROVINCES);
  const clientIds = Object.keys(CLIENT_STATS);
  const client_id = randFrom(clientIds);
  const lat = parseFloat((p.lat+(Math.random()-.5)*3).toFixed(4));
  const lng = parseFloat((p.lng+(Math.random()-.5)*3).toFixed(4));
  return {
    transaction_id:  "TXN_"+Math.floor(1000000+Math.random()*9000000),
    client_id,
    merchant:        m.name, business_type: m.type,
    amt:             randAmt(), date: randDate(), time: randTime(),
    province:        p.name, lat, lng,
    nearest_city:    getNearestCity(lat, lng, p.name),
    income_category: randFrom(INCOME_CATEGORIES),
    education:       randFrom(EDUCATION_LEVELS),
    marital_status:  randFrom(MARITAL_STATUSES),
    card_category:   randFrom(CARD_CATEGORIES),
    months_on_book:  Math.floor(Math.random()*84)+12,
    birthday:        `${1950+Math.floor(Math.random()*45)}-${pad2(Math.floor(Math.random()*12)+1)}-${pad2(Math.floor(Math.random()*28)+1)}`,
  };
}

// ─── Sub-components (receive T = theme) ──────────────────────────────────────

function Field({ label, children, T }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.07em", color:T.muted, textTransform:"uppercase", marginBottom:5 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Inp({ value, onChange, onBlur, type="text", options, step, T }) {
  const base = {
    width:"100%", padding:"8px 12px", borderRadius:8,
    border:`1.5px solid ${T.border}`, background:T.surfaceHi,
    fontSize:14, color:T.text, fontFamily:"'DM Sans',sans-serif",
    outline:"none", transition:"border 0.2s", colorScheme:"dark",
  };
  if (options) return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{...base, cursor:"pointer"}}
      onFocus={e=>{e.target.style.borderColor=T.accent;}}
      onBlur={e=>{e.target.style.borderColor=T.border;}}
    >
      {options.map(o=><option key={o} value={o} style={{background:T.surface,color:T.text}}>{o}</option>)}
    </select>
  );
  return (
    <input type={type} value={value} step={step}
      onChange={e=>onChange(e.target.value)} style={base}
      onFocus={e=>{e.target.style.borderColor=T.accent;}}
      onBlur={e=>{e.target.style.borderColor=T.border; onBlur && onBlur(e.target.value);}}
    />
  );
}

function ScoreBar({ score, T }) {
  const pct   = Math.round(score*100);
  const color = score>0.65 ? T.fraud : score>0.35 ? T.amber : T.safe;
  const label = score>0.65 ? "High Risk" : score>0.35 ? "Moderate" : "Low Risk";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:13,color:T.muted}}>Fraud Probability</span>
        <span style={{fontSize:13,fontWeight:600,color}}>{label}</span>
      </div>
      <div style={{background:T.border,borderRadius:8,height:8,overflow:"hidden"}}>
        <div style={{
          height:"100%",width:`${pct}%`,borderRadius:8,
          background:`linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow:`0 0 10px ${color}66`,
          transition:"width 0.7s cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
      <div style={{textAlign:"right",marginTop:8}}>
        <span style={{
          fontSize:32,fontWeight:600,color,
          fontFamily:"'DM Serif Display',serif",
          textShadow:`0 0 20px ${color}55`,
        }}>
          {pct}<span style={{fontSize:17,fontWeight:400}}>%</span>
        </span>
      </div>
    </div>
  );
}

function Verdict({ score, T, threshold=0.5 }) {
  const fraud = score > threshold;
  const bg  = fraud ? T.fraudBg  : T.safeBg;
  const bdr = fraud ? T.fraudBdr : T.safeBdr;
  const col = fraud ? T.fraud    : T.safe;
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:14,padding:"14px 18px",
      borderRadius:10,background:bg,border:`1.5px solid ${bdr}`,
    }}>
      <div style={{
        width:38,height:38,borderRadius:"50%",flexShrink:0,
        background:col,opacity:0.9,
        display:"flex",alignItems:"center",justifyContent:"center",
        color:"#fff",fontSize:18,fontWeight:700,
        boxShadow:`0 0 14px ${col}55`,
      }}>{fraud?"✕":"✓"}</div>
      <div>
        <div style={{fontWeight:600,fontSize:15,color:col}}>
          {fraud?"Transaction Blocked":"Transaction Approved"}
        </div>
        <div style={{fontSize:12,color:T.muted,marginTop:2}}>
          {fraud?"Flagged for manual review":"No anomalies detected"}
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({ entry, onClose, T, backendUrl, threshold=0.5 }) {
  const windowWidth = useWindowWidth();
  const [drawerFeatures, setDrawerFeatures] = useState(null);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  useEffect(() => {
    if (!entry || !backendUrl) return;
    setDrawerFeatures(null);
    setLoadingFeatures(true);
    const features = {
      amount: parseFloat(entry.txn?.amt||0), business_type: entry.txn?.business_type||"",
      date: entry.txn?.date||"", time: entry.txn?.time||"12:00",
      lat: parseFloat(entry.txn?.lat||0), lng: parseFloat(entry.txn?.lng||0),
      card_category: entry.txn?.card_category||"", income_category: entry.txn?.income_category||"",
      education_level: entry.txn?.education||"", marital_status: entry.txn.marital_status||"",
      birthday: entry.txn.birthday||"", months_on_book: parseInt(entry.txn.months_on_book||0),
    };
    fetch(`${backendUrl}/explain`, { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model_type: entry.model, features }) })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setDrawerFeatures(d?.top_features || []); setLoadingFeatures(false); })
      .catch(() => { setDrawerFeatures([]); setLoadingFeatures(false); });
  }, [entry]);

  if (!entry) return null;
  const fraud = entry.score > threshold;
  const prevFromLog = entry.prevFromLog;
  const vf = entry.velocityFlag;
  const txn = entry.txn || {};
  const rows = [
    ["Transaction ID",  txn.transaction_id || "—"],
    ["Date",            txn.date || "—"],
    ["Time",            txn.time || "—"],
    ["Business Type",   txn.business_type || "—"],
    ["Amount (CAD)",    `$${Number(txn.amt || 0).toFixed(2)}`],
    ["Coordinates",     `${txn.lat || "—"}, ${txn.lng || "—"}`],
    ...(prevFromLog ? [["Prev. Transaction",  `${prevFromLog.txn_id} · ${prevFromLog.city||"?"} @ ${prevFromLog.time}`]] : []),
    ...(vf          ? [["Travel Speed",        vf.speedKmh ? `${vf.speedKmh.toLocaleString()} km/h (${vf.speed.toLocaleString()} mph)` : `${vf.speed.toLocaleString()} mph`]] : []),
    ...(vf?.dist    ? [["Distance",            `${vf.dist.toLocaleString()} km`]] : []),
    ...(vf          ? [["Prev. Location",       vf.prevCity || "—"]] : []),
    ["Card Category",   txn.card_category || "—"],
    ["Income Category", txn.income_category || "—"],
    ["Education",       txn.education || txn.education_level || "—"],
    ["Marital Status",  txn.marital_status || "—"],
    ["Birthday",        txn.birthday || "—"],
    ["Months on Book",  txn.months_on_book ? `${txn.months_on_book} months` : "—"],
    ["Model",           entry.model==="logistic_regression"?"Logistic Regression":"Decision Tree"],
    ["Fraud Score",     `${Math.round(entry.score*100)}%`],
    ["Decision",        fraud?"Blocked":"Approved"],
  ];
  const moderate = entry.score > 0.35 && entry.score <= 0.5;
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",justifyContent:"flex-end"}}
      onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
      <div style={{
        position:"relative",width:windowWidth<=768?"100vw":430,height:"100vh",
        background:T.surface,borderLeft:`1px solid ${T.borderHi}`,
        boxShadow:`-12px 0 50px rgba(0,0,0,0.5)`,
        overflowY:"auto",padding:32,zIndex:1,
        animation:"slideIn 0.25s ease",
      }} onClick={e=>e.stopPropagation()}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",color:T.muted,textTransform:"uppercase",marginBottom:5}}>
              Transaction Details
            </div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:T.text,lineHeight:1.2}}>
              {entry.txn.merchant}
            </div>
            <div style={{fontSize:13,color:T.muted,marginTop:3}}>{entry.txn.date} · {entry.txn.time}</div>
          </div>
          <button onClick={onClose} style={{
            background:T.surfaceHi,border:`1px solid ${T.border}`,
            borderRadius:8,cursor:"pointer",
            fontSize:16,color:T.muted,
            width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",
          }}>✕</button>
        </div>

        <Verdict score={entry.score} T={T} threshold={threshold}/>
        {entry.impossibleTravel && entry.velocityFlag && (
          <div style={{
            margin:"12px 0 0",padding:"10px 14px",borderRadius:8,
            background:"#3b0a0a",border:"1px solid #f87171aa",
            display:"flex",alignItems:"center",gap:10,
          }}>
            <span style={{fontSize:18}}>✈</span>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#f87171",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                Impossible Travel Detected
              </div>
              <div style={{fontSize:11,color:"#fca5a5",marginTop:2}}>
                {entry.velocityFlag.speedKmh?.toLocaleString()} km/h — physically impossible displacement from previous transaction
              </div>
            </div>
          </div>
        )}
        <div style={{margin:"20px 0"}}><ScoreBar score={entry.score} T={T}/></div>

        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:20}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",color:T.muted,textTransform:"uppercase",marginBottom:14}}>
            All Variables
          </div>

          {/* Feature importance — loaded on demand */}
          {(loadingFeatures || (drawerFeatures && drawerFeatures.length > 0)) && (
            <div style={{marginBottom:16, padding:"10px 14px", borderRadius:8,
              background: entry.model==="logistic_regression" ? "#1a2744" : "#0f2318",
              border: `1px solid ${T.accent}66`}}>
              <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:T.accent, marginBottom:8}}>
                {entry.model==="logistic_regression" ? "LR" : "DT"} — TOP CONTRIBUTING FEATURES
              </div>
              {loadingFeatures ? (
                <div style={{fontSize:11, color:T.muted, display:"flex", alignItems:"center", gap:6}}>
                  <span style={{animation:"themePulse 1s ease infinite", display:"inline-block",
                    width:5, height:5, borderRadius:"50%", background:T.accent}}/>
                  Loading…
                </div>
              ) : drawerFeatures.map((f,fi)=>(
                <div key={fi} style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, gap:8}}>
                  <span style={{fontSize:11, color:T.accent+"cc", flex:1}}>{f.feature}</span>
                  <span style={{fontSize:11, fontWeight:700, minWidth:50, textAlign:"right",
                    color: entry.model==="logistic_regression" ? (f.contribution > 0 ? "#f87171" : "#4ade80") : T.accent}}>
                    {entry.model==="logistic_regression"
                      ? `${f.contribution > 0 ? "+" : ""}${f.contribution.toFixed(3)}`
                      : `Δ${f.contribution.toFixed(3)}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {rows.map(([label,val])=>{
            const isVerdict = label==="Decision"||label==="Fraud Score";
            const col = isVerdict ? (fraud?T.fraud:moderate?T.amber:T.safe) : T.text;
            return (
              <div key={label} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"9px 12px",
                marginBottom:2,
                borderBottom:`1px solid ${T.border}`,
              }}>
                <span style={{fontSize:13,color:T.muted}}>{label}</span>
                <span style={{fontSize:13,fontWeight:500,color:col,textAlign:"right",maxWidth:220}}>{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Helper functions ────────────────────────────────────────────────────────

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getLogPrevTxn(clientId, logEntries) {
  if (!clientId || !logEntries || logEntries.length === 0) return null;
  const prev = logEntries.find(e => String(e.txn?.client_id) === String(clientId));
  if (!prev) return null;
  return {
    lat:    parseFloat(prev.txn.lat)  || 0,
    lng:    parseFloat(prev.txn.lng)  || 0,
    time:   prev.txn.time  || "12:00",
    date:   prev.txn.date  || "",
    city:   prev.txn.nearest_city || "",
    txn_id: prev.txn.transaction_id || "",
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export default function ATMFraudSimulator() {
  const [model,      setModel]      = useState("logistic_regression");
  const [txn,        setTxn]        = useState(makeTransaction());
  const [result,     setResult]     = useState(null);
  const [scanning,   setScanning]   = useState(false);
  const [log,        setLog]        = useState([]);
  const [simCount,   setSimCount]   = useState(10);
  const [fraudCount,    setFraudCount]    = useState(3);
  const [randomizeFraud, setRandomizeFraud] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simDone,    setSimDone]    = useState(0);
  const [drawer,     setDrawer]     = useState(null);
  const [backendOk,  setBackendOk]  = useState(null);
  const [activeTab,  setActiveTab]  = useState("simulator");
  const lrThreshRef      = useRef(0.5);          // uncontrolled — no state update on drag
  const dtThreshRef      = useRef(0.5);
  const [lrSliderKey,    setLrSliderKey]    = useState(0); // incremented once to seed defaultValue
  const [dtSliderKey,    setDtSliderKey]    = useState(0);
  const [modelThresholds,  setModelThresholds]  = useState({logistic_regression: 0.5, decision_tree: 0.5});
  const lrThreshLabelRef = useRef(null);
  const dtThreshLabelRef = useRef(null);
  const initialThresholdSet = useRef(false);
  const [rq1LrThreshold,   setRq1LrThreshold]   = useState(0.5);
  const [rq1DtThreshold,   setRq1DtThreshold]   = useState(0.5);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisDone,    setAnalysisDone]    = useState(0);
  const [analysisTotal,   setAnalysisTotal]   = useState(0);
  const [analysisTestSize,   setAnalysisTestSize]   = useState(0.3);
  const [analysisTestScores, setAnalysisTestScores] = useState(null); // {lr_scores, dt_scores, labels}
  const [rq1Drawer,       setRq1Drawer]       = useState(null); // selected RQ1 transaction
  const [rq1Features,     setRq1Features]     = useState({}); // {index: {lrFeatures, dtFeatures}}
  const [rqTab,           setRqTab]           = useState("rq1"); // RQ sub-tab
  const lrSmoteRef        = useRef(false);       // uncontrolled — no state update on toggle
  const dtSmoteRef        = useRef(false);
  const lrSmoteBtnRef     = useRef(null);        // container for LR SMOTE buttons
  const dtSmoteBtnRef     = useRef(null);
  const [lrSmoteApplied,  setLrSmoteApplied]  = useState(false); // committed on Refresh
  const [dtSmoteApplied,  setDtSmoteApplied]  = useState(false);
  const [lrThreshApplied, setLrThreshApplied] = useState(0.5);   // committed on Refresh
  const [dtThreshApplied, setDtThreshApplied] = useState(0.5);
  const [txnFilter,  setTxnFilter]  = useState("all");  // "all"|"fraud"|"legit"
  const [txnAgree,   setTxnAgree]   = useState("all");  // "all"|"agree"|"split"
  const [txnOutcome, setTxnOutcome] = useState("all");  // "all"|"correct"|"lr_wrong"|"dt_wrong"|"both_wrong"
  const [txnSort,    setTxnSort]    = useState({col:null, dir:"desc"}); // col: "amt"|"lr"|"dt"

  // Fetch feature explanations on demand when a drawer is opened
  async function fetchExplain(features, index, lrScore, dtScore) {
    if (rq1Features[index]) return; // already loaded
    try {
      const [lrRes, dtRes] = await Promise.all([
        fetch(`${backendUrl}/explain`, { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ model_type:"logistic_regression", features }) }),
        fetch(`${backendUrl}/explain`, { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ model_type:"decision_tree", features }) }),
      ]);
      const lrData = lrRes.ok ? await lrRes.json() : {};
      const dtData = dtRes.ok ? await dtRes.json() : {};
      setRq1Features(prev => ({
        ...prev,
        [index]: {
          lrFeatures: lrData.top_features || [],
          dtFeatures: dtData.top_features || [],
        }
      }));
    } catch(e) {
      console.error("Explain fetch failed:", e.message);
    }
  }
  const analysisStopRef = useRef(false);
  const simRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const useBackend = true;

  // Poll backend health every 5s
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${backendUrl}/health`, { signal: AbortSignal.timeout(2000) });
        setBackendOk(res.ok);
        if (res.ok) {
          const mRes = await fetch(`${backendUrl}/metrics`, { signal: AbortSignal.timeout(2000) });
          if (mRes.ok) {
            const mData = await mRes.json();
            const lrT = mData.lr?.threshold ?? 0.5;
            const dtT = mData.dt?.threshold ?? 0.5;
            setModelThresholds({ logistic_regression: lrT, decision_tree: dtT });
            if (!initialThresholdSet.current) {
              initialThresholdSet.current = true;
              setRq1LrThreshold(lrT);
              setRq1DtThreshold(dtT);
            }
          }
        }
      } catch {
        setBackendOk(false);
      }
    }
    checkHealth();
    const id = setInterval(checkHealth, 5000);
    return () => clearInterval(id);
  }, []);

  const T = THEMES[model];
  const setField = key => val => setTxn(prev=>({...prev,[key]:val}));

  async function analyze(t=txn, m=model) {
    // Assign a fresh transaction ID every time we analyze
    const freshTxn = { ...t, transaction_id: "TXN_" + Math.floor(1000000 + Math.random() * 9000000) };
    setTxn(freshTxn);
    setScanning(true); setResult(null);

    const prevFromLog = getLogPrevTxn(freshTxn.client_id, log);

    let score = null;
    let usedBackend = false;
    let impossibleTravel = false;
    let speedKmh = null;

    if (useBackend) {
      try {
        const payload = {
          model_type: m,
          features: {
            client_id: freshTxn.client_id,
            amount: parseFloat(freshTxn.amt) || 0,
            business_type: freshTxn.business_type,
            date: freshTxn.date,
            time: freshTxn.time,
            lat: parseFloat(freshTxn.lat) || 0,
            lng: parseFloat(freshTxn.lng) || 0,
            card_category: freshTxn.card_category,
            income_category: freshTxn.income_category,
            education_level: freshTxn.education,
            marital_status: freshTxn.marital_status,
            birthday: freshTxn.birthday,
            months_on_book: parseInt(freshTxn.months_on_book) || 0,
            ...(prevFromLog ? {
              prev_lat: prevFromLog.lat,
              prev_lng: prevFromLog.lng,
              prev_time: prevFromLog.time,
              prev_date: prevFromLog.date,
              prev_city: prevFromLog.city,
              prev_txn_id: prevFromLog.txn_id,
            } : {}),
          },
          lr_code: null,
          dt_code: null,
        };
        const res = await fetch(`${backendUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        score = data.score;
        usedBackend = true;
        impossibleTravel = data.impossible_travel || false;
        speedKmh = data.speed_kmh || null;
      } catch (err) {
        console.error("[Fraud] Backend call failed:", err.message);
        alert(`Analysis failed: ${err.message}\nMake sure the backend is running on port 8000.`);
        setScanning(false);
        return;
      }
    } else {
      setScanning(false);
      return;
    }

    // velocityFlag: use backend's authoritative result if available, else compute locally for display
    let velocityFlag = null;
    if (impossibleTravel && speedKmh) {
      const distKm = prevFromLog
        ? haversineMiles(prevFromLog.lat, prevFromLog.lng, parseFloat(freshTxn.lat), parseFloat(freshTxn.lng)) * 1.60934
        : null;
      velocityFlag = {
        speed: Math.round(speedKmh * 0.621371),  // km/h → mph for display
        speedKmh: Math.round(speedKmh),
        dist: distKm ? Math.round(distKm) : null,
        prevCity: prevFromLog?.city,
        prevTxnId: prevFromLog?.txn_id,
        source: "backend",
      };
    } else if (prevFromLog) {
      const dist = haversineMiles(prevFromLog.lat, prevFromLog.lng, parseFloat(freshTxn.lat), parseFloat(freshTxn.lng));
      const parseTime = s => { const p = (s||"12:00").split(":"); return parseInt(p[0]||0) + parseInt(p[1]||0)/60; };
      let elapsed = parseTime(freshTxn.time) - parseTime(prevFromLog.time);
      if (elapsed <= 0) elapsed = 0.5;
      const speed = Math.round(dist / elapsed);
      if (speed > 100) {
        velocityFlag = { speed, speedKmh: Math.round(speed * 1.60934), dist: Math.round(dist), prevCity: prevFromLog.city, prevTxnId: prevFromLog.txn_id, source: "frontend" };
      }
    }

    setResult(score);
    setLog(prev=>[{id:Date.now(), txn:{...freshTxn}, score, model:m, velocityFlag, impossibleTravel, prevFromLog, usedBackend},...prev]);
    setScanning(false);
  }


  // ── Analysis runner: scores same transactions through both models ──────────
  async function runAnalysis() {
    if (analysisRunning) { analysisStopRef.current = true; return; }
    // Commit current slider positions so the results reflect what was set at click time
    setLrThreshApplied(lrThreshRef.current);
    setDtThreshApplied(dtThreshRef.current);
    setLrSmoteApplied(lrSmoteRef.current);
    setDtSmoteApplied(dtSmoteRef.current);
    setAnalysisRunning(true); setAnalysisDone(0); setAnalysisTotal(0);
    setAnalysisResults(null); analysisStopRef.current = false;
    setRq1Features({});
    setAnalysisTestScores(null);

    try {
      // ── Fetch metrics, test rows, and pre-computed scores in parallel ──
      const [metricsRes, sampleRes, scoresRes] = await Promise.all([
        fetch(`${backendUrl}/metrics`),
        fetch(`${backendUrl}/dataset-sample`),
        fetch(`${backendUrl}/test-scores`),
      ]);

      if (!metricsRes.ok) throw new Error(`Metrics fetch failed: HTTP ${metricsRes.status}`);
      const metricsData = await metricsRes.json();

      if (!metricsData.lr || !metricsData.dt) {
        const missing = [!metricsData.lr && "LR", !metricsData.dt && "DT"].filter(Boolean).join(", ");
        throw new Error(`Metrics not available for: ${missing}. Check Terminal 2 — the model scripts may have crashed.`);
      }

      let txns = [], usingRealData = false;
      if (sampleRes.ok) {
        const sampleData = await sampleRes.json();
        if (sampleData.rows?.length > 0) {
          txns = sampleData.rows.map(r => ({ t: r, label: r.is_fraud }));
          usingRealData = true;
          setAnalysisTotal(sampleData.total);
        }
      }
      if (!usingRealData) { setAnalysisRunning(false); alert("Could not fetch test data from backend."); return; }

      if (!scoresRes.ok) throw new Error(`Test scores fetch failed: HTTP ${scoresRes.status}`);
      const scoresData = await scoresRes.json();
      setAnalysisDone(txns.length);

      // Use pre-stored test scores (same source as confusion matrix) so the table is consistent
      const labels   = txns.map(x => x.label);
      const lrScores = scoresData.lr_scores          || [];
      const dtScores = scoresData.dt_scores          || [];
      const lrScoresNS = scoresData.lr_no_smote_scores || [];
      const dtScoresNS = scoresData.dt_no_smote_scores || [];

      setAnalysisResults({
        runId: Date.now(),
        lrMetrics: metricsData.lr,
        dtMetrics: metricsData.dt,
        labels, lrScores, dtScores,
        testScores: scoresData,
        usingRealData,
        txns: txns.map((x,i) => ({...x.t, amt: parseFloat(x.t.amt||x.t.amount||0),
          label: labels[i],
          lrScore:   lrScores[i]   ?? 0,
          dtScore:   dtScores[i]   ?? 0,
          lrScoreNS: lrScoresNS[i] ?? 0,
          dtScoreNS: dtScoresNS[i] ?? 0,
        })),
        nFraud: labels.filter(l=>l===1).length,
        nLegit:  labels.filter(l=>l===0).length,
      });
    } catch(e) {
      console.error("[Fraud] Analysis failed:", e.message);
      alert(`Analysis failed: ${e.message}`);
    }

    setAnalysisRunning(false);
  }


  const simStopRef = useRef(false);

  async function startSim() {
    if (simRunning) { simStopRef.current = true; return; }
    const total = Math.max(1,parseInt(simCount)||10);
    setSimRunning(true); setSimDone(0); simStopRef.current = false;

    for (let count = 0; count < total; count++) {
      if (simStopRef.current) break;

      const isFraud = Math.random() < 0.5;
      const t = isFraud ? makeFraudTransaction() : makeLegitTransaction(model);
      t.transaction_id = "TXN_" + Math.floor(1000000 + Math.random() * 9000000);

      let score;
      let simImpossible = false;
      let simSpeedKmh = null;
      if (useBackend) {
        try {
          const payload = {
            model_type: model,
            features: {
              client_id: t.client_id, amount: parseFloat(t.amt)||0,
              business_type: t.business_type,
              date: t.date, time: t.time,
              lat: parseFloat(t.lat)||0, lng: parseFloat(t.lng)||0,
              card_category: t.card_category,
              income_category: t.income_category, education_level: t.education,
              marital_status: t.marital_status, birthday: t.birthday,
              months_on_book: parseInt(t.months_on_book)||0,
            },
            lr_code: null,
            dt_code: null,
          };
          const res = await fetch(`${backendUrl}/predict`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          score = data.score;
          simImpossible = data.impossible_travel || false;
          simSpeedKmh = data.speed_kmh || null;
          } catch (err) {
            console.error("[Fraud] Sim backend call failed:", err.message);
            continue;
          }
      } else {
        // Backend is always required — skip transaction
        continue;
      }

      const simVelocityFlag = simImpossible && simSpeedKmh
        ? { speed: Math.round(simSpeedKmh * 0.621371), speedKmh: Math.round(simSpeedKmh), source: "backend" }
        : null;

      setTxn(t); setResult(score);
      setLog(prev=>[{id:Date.now()+count, txn:{...t}, score, model, impossibleTravel: simImpossible, velocityFlag: simVelocityFlag},...prev]);
      setSimDone(count+1);

      // Pace the simulation — minimal delay when using backend (network latency already provides pacing)
      await new Promise(r => setTimeout(r, useBackend ? 30 : 150));
    }

    setSimRunning(false);
  }

  useEffect(()=>()=>{ simStopRef.current = true; },[]);

  const flagged  = log.filter(e=>e.score >  (modelThresholds[e.model] ?? 0.5)).length;
  const approved = log.filter(e=>e.score <= (modelThresholds[e.model] ?? 0.5)).length;
  const total    = Math.max(1,parseInt(simCount)||10);

  // Pre-compute threshold sweep once when analysis results change (not on every render)
  const [lrSweepMemo, dtSweepMemo] = useMemo(() => {
    if (!analysisResults) return [[], []];
    const ts = analysisResults.testScores;
    const lrS = ts?.lr_scores || analysisResults.lrScores || [];
    const dtS = ts?.dt_scores || analysisResults.dtScores || [];
    const lbS = ts?.lr_labels || ts?.dt_labels || analysisResults.labels || [];
    const sweepT = Array.from({length:91},(_,i)=>parseFloat((0.05+i*0.01).toFixed(2)));
    function cm(scores, labels, thresh) {
      let tp=0,fp=0,tn=0,fn=0;
      scores.forEach((s,i)=>{ const p=s>=thresh?1:0; if(p&&labels[i])tp++; else if(p&&!labels[i])fp++; else if(!p&&!labels[i])tn++; else fn++; });
      const pr=tp+fp>0?tp/(tp+fp):0, re=tp+fn>0?tp/(tp+fn):0;
      return {tp,fp,tn,fn,precision:pr,recall:re,f1:pr+re>0?2*pr*re/(pr+re):0,accuracy:(tp+tn)/Math.max(scores.length,1)};
    }
    return [sweepT.map(t=>cm(lrS,lbS,t)), sweepT.map(t=>cm(dtS,lbS,t))];
  }, [analysisResults]);

  return (
    <>
      <style>{`
        @import url('${FONT_LINK}');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};transition:background 0.4s}
        select,input{font-family:'DM Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanBeam{0%{top:-4px;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes scanPulse{0%,100%{box-shadow:0 0 0px var(--scan-color)}50%{box-shadow:0 0 18px var(--scan-color),0 0 40px var(--scan-color)33}}
        @keyframes cornerBlink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes themePulse{0%{opacity:0.6}50%{opacity:1}100%{opacity:0.6}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      `}</style>

      {drawer && <DetailDrawer entry={drawer} onClose={()=>setDrawer(null)} T={THEMES[drawer.model]} backendUrl={backendUrl} threshold={modelThresholds[drawer.model] ?? 0.5}/>}

      <div className="main-wrapper" style={{minHeight:"100vh",background: activeTab==="analysis" ? PURPLE.bg : T.bg,padding:"32px 24px 64px",transition:"background 0.4s"}}>

        {/* Subtle top glow accent */}
        <div style={{
          position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",
          width:"60%",height:1,
          background:`linear-gradient(90deg,transparent,${T.accent},transparent)`,
          opacity:0.6,pointerEvents:"none",zIndex:0,
        }}/>

        {/* ── Header ── */}
        <div style={{maxWidth:1060,margin:"0 auto 28px",position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
            <div>
              <div style={{
                fontSize:11,fontWeight:600,letterSpacing:"0.12em",
                color:T.accent,textTransform:"uppercase",marginBottom:5,
                display:"flex",alignItems:"center",gap:8,
              }}>
                <span style={{
                  display:"inline-block",width:6,height:6,borderRadius:"50%",
                  background:T.accent,boxShadow:`0 0 8px ${T.accent}`,
                  animation:"themePulse 2s ease infinite",
                }}/>
                {T.label} · ACTIVE
              </div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:T.text,lineHeight:1.1}}>
                Fraud Detection Simulator
              </div>
              <div style={{fontSize:13,color:T.muted,marginTop:4}}>Canadian Transaction Analysis</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                <span style={{
                  width:7,height:7,borderRadius:"50%",display:"inline-block",flexShrink:0,
                  background: backendOk === null ? T.amber : backendOk ? T.safe : T.fraud,
                  boxShadow: `0 0 6px ${backendOk === null ? T.amber : backendOk ? T.safe : T.fraud}`,
                }}/>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",
                  color: backendOk === null ? T.amber : backendOk ? T.safe : T.fraud,
                }}>
                  {backendOk === null ? "Connecting…" : backendOk ? "Backend · Python Models Active" : "Backend Offline"}
                </span>
                {backendOk && (
                  <button onClick={async () => {
                    try {
                      const r = await fetch(`${backendUrl}/retrain`, { method:"POST" });
                      if (r.ok) alert("✓ Models retrained successfully");
                      else alert("✗ Retrain failed — check Terminal 2");
                    } catch(e) { alert(`Backend unreachable: ${e.message}`); }
                  }} style={{
                    padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:700,
                    border:`1px solid ${T.accent}66`, background:"transparent",
                    color:T.accent, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                    letterSpacing:"0.05em", textTransform:"uppercase",
                  }}>↺ Retrain</button>
                )}
              </div>
            </div>

            {/* Model Toggle */}
            <div style={{
              display:"flex",
              background:T.surfaceHi,
              borderRadius:12,padding:4,
              border:`1px solid ${T.border}`,
            }}>
              {[
                ["logistic_regression","Logistic Regression"],
                ["decision_tree","Decision Tree"],
              ].map(([val,label])=>(
                <button key={val} onClick={()=>{ setModel(val); setResult(null); }} style={{
                  padding:"9px 20px",borderRadius:9,border:"none",
                  background: model===val
                    ? `linear-gradient(135deg,${THEMES[val].accentDim},${THEMES[val].surfaceHi})`
                    : "transparent",
                  boxShadow: model===val ? `0 0 14px ${THEMES[val].accentGlow}` : "none",
                  color: model===val ? THEMES[val].accent : T.muted,
                  fontWeight: model===val ? 600 : 400,
                  fontSize:13, cursor:"pointer", transition:"all 0.3s",
                  fontFamily:"'DM Sans',sans-serif",
                  borderRight: val==="logistic_regression" ? `1px solid ${T.border}` : "none",
                  borderRadius: val==="logistic_regression" ? "9px 0 0 9px" : "0 9px 9px 0",
                }}>{label}</button>
              ))}
            </div>
          </div>
          {/* ── Tab Nav ── */}
          <div className="tab-bar" style={{display:"flex",alignItems:"center",marginTop:20,borderBottom:`1px solid ${T.border}`}}>
            {[["simulator","⬡  Simulator"],["analysis","◎  Analysis"],["rq","⊞  Research Questions"]].map(([tab,label])=>(
              <button key={tab} onClick={()=>{ setActiveTab(tab); if((tab==="analysis"||tab==="rq")&&!analysisResults&&!analysisRunning) runAnalysis(); }} style={{
                padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",border:"none",
                borderBottom: activeTab===tab ? `2px solid ${T.accent}` : "2px solid transparent",
                background:"transparent",
                color: activeTab===tab ? T.accent : T.muted,
                letterSpacing:"0.04em",transition:"all 0.2s",marginBottom:-1,
              }}>{label}</button>
            ))}
          </div>
        </div>

        {activeTab === "simulator" && (<>
        {/* ── Main grid ── */}
        <div className="sim-main-grid" style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,position:"relative",zIndex:1}}>

          {/* ── Left: Transaction Editor ── */}
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <div style={{
              background:T.surface,borderRadius:16,
              border:`1px solid ${T.border}`,padding:28,
              boxShadow:`0 4px 30px rgba(0,0,0,0.3)`,
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div style={{fontSize:16,fontWeight:600,color:T.text}}>Transaction</div>
                <button onClick={()=>{setTxn(makeTransaction());setResult(null);}} style={{
                  padding:"6px 14px",borderRadius:8,
                  border:`1px solid ${T.border}`,
                  background:T.surfaceHi,cursor:"pointer",fontSize:13,color:T.mutedHi,
                  fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.mutedHi;}}
                >↻ Randomize</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                <Field label="Business Type" T={T}>
                  <Inp T={T} value={txn.business_type} onChange={v=>{
                    setTxn(p=>({...p, business_type:v}));
                  }} options={[...new Set(MERCHANTS.map(m=>m.type))].sort()}/>
                </Field>
                <Field label="Amount (CAD $)" T={T}>
                  <Inp T={T} type="number" step="0.01" value={txn.amt} onChange={v=>setField("amt")(v)} onBlur={v=>setField("amt")(parseFloat(v)||0)}/>
                </Field>
                <Field label="Date" T={T}>
                  <Inp T={T} type="date" value={txn.date} onChange={setField("date")}/>
                </Field>
                <Field label="Time (24h)" T={T}>
                  <Inp T={T} type="time" value={txn.time} onChange={setField("time")}/>
                </Field>
                <Field label="Card Category" T={T}>
                  <Inp T={T} value={txn.card_category} onChange={setField("card_category")} options={CARD_CATEGORIES}/>
                </Field>
                <Field label="Income Category" T={T}>
                  <Inp T={T} value={txn.income_category} onChange={setField("income_category")} options={INCOME_CATEGORIES}/>
                </Field>
                <Field label="Education Level" T={T}>
                  <Inp T={T} value={txn.education} onChange={setField("education")} options={EDUCATION_LEVELS}/>
                </Field>
                <Field label="Marital Status" T={T}>
                  <Inp T={T} value={txn.marital_status} onChange={setField("marital_status")} options={MARITAL_STATUSES}/>
                </Field>
                <Field label="Birthday" T={T}>
                  <Inp T={T} type="date" value={txn.birthday} onChange={setField("birthday")}/>
                </Field>
                <Field label="Months on Book" T={T}>
                  <Inp T={T} type="number" value={txn.months_on_book} onChange={v=>setField("months_on_book")(parseInt(v)||0)}/>
                </Field>
                <Field label="Latitude" T={T}>
                  <Inp T={T} type="number" step="0.0001" value={txn.lat} onChange={v=>setField("lat")(parseFloat(v)||43.5)}/>
                </Field>
                <Field label="Longitude" T={T}>
                  <Inp T={T} type="number" step="0.0001" value={txn.lng} onChange={v=>setField("lng")(parseFloat(v)||-79.5)}/>
                </Field>
              </div>

              <button onClick={()=>analyze()} disabled={scanning} style={{
                width:"100%",marginTop:8,padding:"13px",
                background: scanning ? T.surfaceHi : `linear-gradient(135deg,${T.accentDim},${T.accent}33)`,
                color: scanning ? T.muted : T.accent,
                border:`1.5px solid ${scanning?T.border:T.accent+"66"}`,
                borderRadius:10,fontSize:14,fontWeight:600,
                cursor:scanning?"wait":"pointer",transition:"all 0.25s",
                fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.01em",
                boxShadow:scanning?"none":`0 0 20px ${T.accentGlow}`,
              }}>
                {scanning ? "Analyzing…" : "Analyze Transaction"}
              </button>
            </div>

          </div>

          {/* ── Right: Results ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16,animation:"fadeUp 0.5s ease"}}>

            {/* Result card */}
            <div style={{
              background:T.surface,borderRadius:16,
              border:`1px solid ${T.border}`,padding:28,
              boxShadow:`0 4px 30px rgba(0,0,0,0.3)`,
            }}>
              <div style={{fontSize:16,fontWeight:600,color:T.text,marginBottom:20}}>Analysis Result</div>
              {result!==null ? (
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <ScoreBar score={result} T={T}/>
                  <div style={{marginTop:16}}><Verdict score={result} T={T} threshold={modelThresholds[model] ?? 0.5}/></div>
                </div>
              ) : (
                <div style={{padding:"48px 0",textAlign:"center",color:T.muted,fontSize:14}}>
                  Run a transaction to see results
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[
                {label:"Total Analyzed",val:log.length, color:T.text,  bg:T.surface},
                {label:"Flagged",        val:flagged,    color:T.fraud, bg:T.surface},
                {label:"Approved",       val:approved,   color:T.safe,  bg:T.surface},
              ].map(s=>(
                <div key={s.label} style={{
                  background:s.bg,border:`1px solid ${T.border}`,
                  borderRadius:12,padding:"18px 14px",textAlign:"center",
                  boxShadow:`0 4px 20px rgba(0,0,0,0.25)`,
                }}>
                  <div style={{
                    fontFamily:"'DM Serif Display',serif",fontSize:28,color:s.color,
                    textShadow:s.color!==T.text?`0 0 14px ${s.color}55`:"none",
                  }}>{s.val}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* ── Auto Simulation ── */}
            <div style={{
              background:T.surface,borderRadius:16,
              border:`1.5px solid ${simRunning ? T.accent+"88" : T.border}`,padding:24,marginTop:16,
              boxShadow: simRunning ? `0 0 0px ${T.accent}, 0 4px 30px rgba(0,0,0,0.3), inset 0 0 30px ${T.accent}08` : `0 4px 30px rgba(0,0,0,0.3)`,
              position:"relative", overflow:"hidden",
              transition:"border-color 0.3s, box-shadow 0.3s",
            }}>
              {/* Scan beam */}
              {simRunning && (
                <div style={{
                  position:"absolute", left:0, right:0, height:2, top:0,
                  background:`linear-gradient(90deg, transparent 0%, ${T.accent} 40%, ${T.accent} 60%, transparent 100%)`,
                  boxShadow:`0 0 12px ${T.accent}, 0 0 24px ${T.accent}66`,
                  animation:"scanBeam 0.6s linear infinite",
                  zIndex:2, pointerEvents:"none",
                  "--scan-color": T.accent,
                }}/>
              )}
              {/* Corner brackets */}
              {simRunning && ["topLeft","topRight","bottomLeft","bottomRight"].map((pos,i)=>(<div key={pos} style={{
                position:"absolute", width:14, height:14, zIndex:3, pointerEvents:"none",
                top: pos.includes("top") ? 8 : "auto",
                bottom: pos.includes("bottom") ? 8 : "auto",
                left: pos.includes("Left") ? 8 : "auto",
                right: pos.includes("Right") ? 8 : "auto",
                borderTop: pos.includes("top") ? `2px solid ${T.accent}` : "none",
                borderBottom: pos.includes("bottom") ? `2px solid ${T.accent}` : "none",
                borderLeft: pos.includes("Left") ? `2px solid ${T.accent}` : "none",
                borderRight: pos.includes("Right") ? `2px solid ${T.accent}` : "none",
                animation:`cornerBlink 1.2s ease ${i*0.3}s infinite`,
              }}/>))}
              <div style={{fontSize:15,fontWeight:600,color:T.text,marginBottom:3}}>Auto Simulation</div>
              <div style={{fontSize:13,color:T.muted,marginBottom:18}}>Stream multiple random transactions automatically</div>

              {/* Total + randomize row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"0 16px",alignItems:"end",marginBottom:14}}>
                <Field label="Total Transactions" T={T}>
                  <Inp T={T} type="number" value={simCount}
                    onChange={v=>setSimCount(parseInt(v)||'')}
                    onBlur={()=>setSimCount(Math.max(1, parseInt(simCount)||1))}
                  />
                </Field>
              </div>


              {simRunning && (
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,marginBottom:6}}>
                    <span>Running… {simDone} of {total}</span>
                    <span style={{color:T.accent}}>{Math.round((simDone/total)*100)}%</span>
                  </div>
                  <div style={{background:T.border,borderRadius:8,height:7,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",borderRadius:8,
                      background:`linear-gradient(90deg,${T.accentDim},${T.accent})`,
                      boxShadow:`0 0 8px ${T.accent}66`,
                      width:`${(simDone/total)*100}%`,transition:"width 0.4s ease",
                    }}/>
                  </div>
                </div>
              )}

              <button onClick={startSim} style={{
                width:"100%",padding:"11px",
                background: simRunning ? T.fraudBg : T.surfaceHi,
                color: simRunning ? T.fraud : T.mutedHi,
                border:`1px solid ${simRunning?T.fraudBdr:T.border}`,
                borderRadius:10,fontSize:13,fontWeight:600,
                cursor:"pointer",transition:"all 0.2s",
                fontFamily:"'DM Sans',sans-serif",
              }}>
                {simRunning?`Stop (${simDone}/${total} done)`:`Run ${simCount} Simulation${simCount!=1?"s":""}`}
              </button>
            </div>
          </div>
        </div>

        {/* ── Transaction Log ── */}
        <div className="txn-log-container" style={{
          maxWidth:1060,margin:"20px auto 0",
          background:T.surface,borderRadius:16,
          border:`1px solid ${T.border}`,padding:28,
          boxShadow:`0 4px 30px rgba(0,0,0,0.3)`,
          position:"relative",zIndex:1,
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:16,fontWeight:600,color:T.text}}>Transaction Log</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:13,color:T.muted}}>
                {log.length} {log.length===1?"entry":"entries"} — click any row to review
              </div>
              {log.length>0 && (
                <button
                  onClick={()=>setLog([])}
                  style={{
                    padding:"5px 12px",borderRadius:7,fontSize:12,fontWeight:500,
                    background:T.fraudBg,color:T.fraud,
                    border:`1px solid ${T.fraudBdr}`,
                    cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.fraud;e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.fraudBg;e.currentTarget.style.color=T.fraud;}}
                >
                  Reset Log
                </button>
              )}
            </div>
          </div>

          {log.length>0 ? (
            <>
              <div className="table-scroll"><div style={{minWidth:700}}>
              <div style={{
                display:"grid",gridTemplateColumns:"1.2fr 1.5fr 0.9fr 0.9fr 0.8fr 90px 36px 28px",
                padding:"8px 14px",background:T.tag,borderRadius:8,marginBottom:6,
                border:`1px solid ${T.tagBorder}`,
              }}>
                {["Transaction ID","Merchant","Amount","Date","Model","Risk","",""].map((h,i)=>(
                  <span key={i} style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>
                    {h}
                  </span>
                ))}
              </div>

              <div style={{maxHeight:400,overflowY:"auto"}}>
                {log.slice(0, 100).map(entry=>{
                  const fraud   = entry.score > (modelThresholds[entry.model] ?? 0.5);
                  const rowTheme= THEMES[entry.model];
                  return (
                    <div key={entry.id}
                      style={{
                        display:"grid",gridTemplateColumns:"1.2fr 1.5fr 0.9fr 0.9fr 0.8fr 90px 36px 28px",
                        padding:"11px 14px",borderRadius:8,
                        transition:"background 0.15s",marginBottom:2,
                        border:"1px solid transparent",alignItems:"center",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHi;e.currentTarget.style.borderColor=T.border;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";}}
                    >
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:12,color:T.muted,fontFeatureSettings:"'tnum'",cursor:"pointer"}}>{entry.txn.transaction_id.slice(-10)}</span>
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:13,fontWeight:500,color:T.text,cursor:"pointer"}}>{entry.txn.merchant}</span>
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:13,color:T.text,cursor:"pointer"}}>${Number(entry.txn.amt).toFixed(2)}</span>
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:13,color:T.muted,cursor:"pointer"}}>{entry.txn.date}</span>
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:12,color:rowTheme.accent,display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:rowTheme.accent,display:"inline-block",flexShrink:0}}/>
                        {entry.model==="logistic_regression"?"Log. Reg.":"Dec. Tree"}
                        {entry.usedBackend === false && (
                          <span style={{fontSize:9,fontWeight:700,padding:"1px 4px",borderRadius:3,
                            background:T.amberBg,color:T.amber,border:`1px solid ${T.amber}44`,
                            letterSpacing:"0.04em",lineHeight:1.4,
                          }}>MOCK</span>
                        )}
                      </span>
                      <span onClick={()=>setDrawer(entry)} style={{cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:fraud?T.fraudBg:T.safeBg,border:`1px solid ${fraud?T.fraudBdr:T.safeBdr}`,color:fraud?T.fraud:T.safe,width:"fit-content"}}>
                        {Math.round(entry.score*100)}%
                      </span>
                      {/* Delete button */}
                      <button
                        onClick={e=>{e.stopPropagation();setLog(prev=>prev.filter(x=>x.id!==entry.id));}}
                        title="Delete entry"
                        style={{
                          width:26,height:26,borderRadius:6,border:`1px solid ${T.border}`,
                          background:"transparent",color:T.muted,
                          fontSize:14,cursor:"pointer",display:"flex",
                          alignItems:"center",justifyContent:"center",
                          transition:"all 0.15s",fontFamily:"inherit",lineHeight:1,
                          padding:0,
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.background=T.fraudBg;e.currentTarget.style.borderColor=T.fraudBdr;e.currentTarget.style.color=T.fraud;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.muted;}}
                      >×</button>
                      <span onClick={()=>setDrawer(entry)} style={{fontSize:14,color:T.muted,textAlign:"center",cursor:"pointer"}}>›</span>
                    </div>
                  );
                })}
              </div>
              </div></div>
            </>
          ) : (
            <div style={{padding:"40px 0",textAlign:"center",color:T.muted,fontSize:14}}>
              No transactions yet — run an analysis or start a simulation
            </div>
          )}
        </div>
        </>) } {/* end activeTab === simulator */}

        {/* ── Analysis Panel ── */}
        {activeTab === "analysis" && (() => {
          const AP = PURPLE; // Analysis Purple theme
          return (
        <div style={{maxWidth:1060,margin:"0 auto",position:"relative",zIndex:1,animation:"fadeUp 0.3s ease"}}>

          {/* Config + Run */}
          <div style={{background:AP.surface,border:`1px solid ${AP.border}`,borderRadius:16,padding:28,marginBottom:20,boxShadow:`0 4px 30px rgba(0,0,0,0.3)`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:analysisResults?16:0,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:16,fontWeight:600,color:AP.text,marginBottom:4}}>Model Comparison</div>
                <div style={{fontSize:13,color:AP.muted,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {analysisResults && analysisResults.usingRealData ? (
                    <span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,
                      background:`${AP.safe}22`, color:AP.safe, border:`1px solid ${AP.safe}44`,
                    }}>✓ {analysisResults.nFraud + analysisResults.nLegit} held-out test rows ({analysisResults.nFraud} fraud / {analysisResults.nLegit} legit)</span>
                  ) : analysisRunning ? (
                    <span style={{fontSize:12,color:AP.muted}}>Loading test data…</span>
                  ) : (
                    <span style={{fontSize:12,color:AP.muted}}>Scores the held-out test set through both models</span>
                  )}
                </div>
              </div>
              <button onClick={()=>runAnalysis()} style={{
                padding:"10px 28px",borderRadius:10,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${AP.accent},${AP.accentDim})`,
                color:"#fff",fontWeight:700,fontSize:14,fontFamily:"'DM Sans',sans-serif",
                boxShadow:`0 0 20px ${AP.accentGlow}`,transition:"all 0.2s",whiteSpace:"nowrap",
                opacity: analysisRunning ? 0.6 : 1,
              }}>
                {analysisRunning ? `Scoring… ${analysisDone}/${analysisTotal}` : analysisResults ? "↻ Refresh" : "▶ Load Analysis"}
              </button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {label:"LR", fullLabel:"Logistic Regression", accent:THEMES.logistic_regression.accent, threshRef:lrThreshRef, sliderKey:lrSliderKey, labelRef:lrThreshLabelRef, smoteRef:lrSmoteRef, smoteBtnRef:lrSmoteBtnRef},
                {label:"DT", fullLabel:"Decision Tree",        accent:THEMES.decision_tree.accent,       threshRef:dtThreshRef, sliderKey:dtSliderKey, labelRef:dtThreshLabelRef, smoteRef:dtSmoteRef, smoteBtnRef:dtSmoteBtnRef},
              ].map(({label,fullLabel,accent,threshRef,sliderKey,labelRef,smoteRef,smoteBtnRef})=>(
                <div key={label} style={{borderRadius:10,border:`1px solid ${accent}33`,padding:"10px 14px",background:`${accent}08`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{fontSize:10,fontWeight:600,color:accent,letterSpacing:"0.07em",textTransform:"uppercase"}}>
                      {fullLabel} — <span ref={labelRef}>{Math.round(threshRef.current*100)}</span>%
                    </div>
                    <div ref={smoteBtnRef} style={{display:"flex",borderRadius:5,overflow:"hidden",border:`1px solid ${accent}44`}}>
                      {[true,false].map(v=>(
                        <button key={String(v)} onClick={()=>{
                          smoteRef.current = v;
                          if (smoteBtnRef.current) {
                            Array.from(smoteBtnRef.current.children).forEach((btn,i)=>{
                              const active = i===0 ? v===true : v===false;
                              btn.style.background = active ? accent : "transparent";
                              btn.style.color = active ? "#0a0c10" : accent;
                            });
                          }
                        }} style={{
                          padding:"2px 8px",fontSize:9,fontWeight:700,cursor:"pointer",border:"none",
                          fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.05em",textTransform:"uppercase",
                          background: v===smoteRef.current ? accent : "transparent",
                          color: v===smoteRef.current ? "#0a0c10" : accent,
                          transition:"background 0.15s",
                        }}>{v?"SMOTE":"No SMOTE"}</button>
                      ))}
                    </div>
                  </div>
                  <input type="range" min={0} max={1} step={0.01} key={sliderKey}
                    defaultValue={threshRef.current}
                    onChange={e=>{ threshRef.current=parseFloat(e.target.value); if(labelRef.current) labelRef.current.textContent=Math.round(threshRef.current*100); }}
                    style={{width:"100%",accentColor:accent}}/>
                </div>
              ))}
            </div>

            {analysisRunning && (
              <div style={{marginTop:14}}>
                <div style={{height:3,borderRadius:4,background:AP.border,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:4,background:AP.accent,
                    width:`${(analysisDone/Math.max(analysisTotal,1))*100}%`,
                    transition:"width 0.3s",boxShadow:`0 0 8px ${AP.accent}`}}/>
                </div>
              </div>
            )}
          </div>

          {analysisResults && (() => {
            // Recompute metrics from full test set scores at current threshold
            function computeMetrics(scores, labels, thresh) {
              if (!scores || !labels) return { tp:0, fp:0, tn:0, fn:0, precision:0, recall:0, f1:0, accuracy:0, cm:[[0,0],[0,0]] };
              let tp=0,fp=0,tn=0,fn=0;
              scores.forEach((s,i) => {
                const pred = s >= thresh ? 1 : 0;
                if (pred===1 && labels[i]===1) tp++;
                else if (pred===1 && labels[i]===0) fp++;
                else if (pred===0 && labels[i]===0) tn++;
                else fn++;
              });
              const precision = tp+fp>0 ? tp/(tp+fp) : 0;
              const recall    = tp+fn>0 ? tp/(tp+fn) : 0;
              const f1        = precision+recall>0 ? 2*precision*recall/(precision+recall) : 0;
              const accuracy  = (tp+tn)/(tp+fp+tn+fn);
              return { tp, fp, tn, fn, precision, recall, f1, accuracy, cm:[[tn,fp],[fn,tp]] };
            }

            const ts = analysisResults.testScores;
            const lrM = lrSmoteApplied
              ? computeMetrics(ts?.lr_scores,          ts?.lr_labels,          lrThreshApplied)
              : computeMetrics(ts?.lr_no_smote_scores, ts?.lr_no_smote_labels, lrThreshApplied);
            const dtM = dtSmoteApplied
              ? computeMetrics(ts?.dt_scores,          ts?.dt_labels,          dtThreshApplied)
              : computeMetrics(ts?.dt_no_smote_scores, ts?.dt_no_smote_labels, dtThreshApplied);

            const MetricCard = ({label, lrVal, dtVal, fmt=v=>v, higherBetter=true}) => {
              const lrN = parseFloat(lrVal), dtN = parseFloat(dtVal);
              const lrWins = higherBetter ? lrN >= dtN : lrN <= dtN;
              return (
                <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12}}>{label}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[["Log. Reg.", lrN, lrWins, THEMES.logistic_regression.accent],
                      ["Dec. Tree", dtN, !lrWins, THEMES.decision_tree.accent]].map(([name,val,wins,accent])=>(
                      <div key={name} style={{
                        padding:"10px 12px",borderRadius:8,
                        background: wins ? `${accent}18` : T.surfaceHi,
                        border: wins ? `1px solid ${accent}44` : `1px solid ${AP.border}`,
                        position:"relative",
                      }}>
                        <div style={{fontSize:11,color:AP.muted,marginBottom:4}}>{name}</div>
                        <div style={{fontSize:22,fontWeight:700,color:wins?accent:T.text,fontFamily:"'DM Serif Display',serif"}}>
                          {fmt(val)}
                        </div>
                        {wins && <div style={{position:"absolute",top:8,right:8,fontSize:9,fontWeight:700,
                          padding:"2px 5px",borderRadius:3,background:accent,color:"#fff",letterSpacing:"0.05em"}}>BETTER</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            };

            const ConfMatrix = ({m, label, accent}) => {
              // m can be {tp,fp,tn,fn} from curve OR {cm:[[tn,fp],[fn,tp]]} from Python script
              const tp = m.cm ? m.cm[1][1] : m.tp;
              const fp = m.cm ? m.cm[0][1] : m.fp;
              const tn = m.cm ? m.cm[0][0] : m.tn;
              const fn = m.cm ? m.cm[1][0] : m.fn;
              return (
                <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12}}>{label} — Confusion Matrix</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[
                      {label:"True Negative", val:tn, color:AP.safe,  sub:"Legit approved"},
                      {label:"False Positive",val:fp, color:AP.amber, sub:"False alarms"},
                      {label:"False Negative",val:fn, color:AP.fraud, sub:"Fraud missed"},
                      {label:"True Positive", val:tp, color:AP.muted, sub:"Fraud caught"},
                    ].map(({label:l,val,color,sub})=>(
                      <div key={l} style={{padding:"10px 12px",borderRadius:8,background:AP.surfaceHi,border:`1px solid ${AP.border}`}}>
                        <div style={{fontSize:10,color:AP.muted,marginBottom:2}}>{l}</div>
                        <div style={{fontSize:24,fontWeight:700,color,fontFamily:"'DM Serif Display',serif"}}>{val ?? "—"}</div>
                        <div style={{fontSize:10,color:AP.muted}}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            };



            return (
              <div key={analysisResults.runId} style={{display:"grid",gap:16}}>
                {/* Metrics row */}
                <div className="metrics-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
                  <MetricCard label="F1 Score" lrVal={lrM.f1} dtVal={dtM.f1} fmt={v=>(v*100).toFixed(1)+"%"}/>
                  <MetricCard label="Precision" lrVal={lrM.precision} dtVal={dtM.precision} fmt={v=>(v*100).toFixed(1)+"%"}/>
                  <MetricCard label="Recall" lrVal={lrM.recall} dtVal={dtM.recall} fmt={v=>(v*100).toFixed(1)+"%"}/>
                  <MetricCard label="Accuracy" lrVal={lrM.accuracy} dtVal={dtM.accuracy} fmt={v=>(v*100).toFixed(1)+"%"}/>
                </div>

                {/* Confusion matrices */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <ConfMatrix m={lrM} label="Logistic Regression" accent={THEMES.logistic_regression.accent}/>
                  <ConfMatrix m={dtM} label="Decision Tree" accent={THEMES.decision_tree.accent}/>
                </div>


                {/* Per-transaction comparison table */}
                <div style={{background:AP.surface,border:`1px solid ${AP.border}`,borderRadius:16,padding:28,boxShadow:`0 4px 30px rgba(0,0,0,0.3)`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
                    <div style={{fontSize:16,fontWeight:600,color:AP.text}}>Transaction-by-Transaction Comparison</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      {/* Truth filter */}
                      {[["all","All"],["fraud","Fraud"],["legit","Legit"]].map(([v,label])=>(
                        <button key={v} onClick={()=>setTxnFilter(v)} style={{
                          padding:"3px 10px",borderRadius:5,border:`1px solid ${txnFilter===v?AP.accent:AP.border}`,
                          background:txnFilter===v?`${AP.accent}22`:"transparent",
                          color:txnFilter===v?AP.accent:AP.muted,fontSize:11,fontWeight:600,cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",
                        }}>{label}</button>
                      ))}
                      <div style={{width:1,height:16,background:AP.border}}/>
                      {/* Agreement filter */}
                      {[["all","All"],["agree","Agree"],["split","Split"]].map(([v,label])=>(
                        <button key={v} onClick={()=>setTxnAgree(v)} style={{
                          padding:"3px 10px",borderRadius:5,border:`1px solid ${txnAgree===v?AP.accent:AP.border}`,
                          background:txnAgree===v?`${AP.accent}22`:"transparent",
                          color:txnAgree===v?AP.accent:AP.muted,fontSize:11,fontWeight:600,cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",
                        }}>{label}</button>
                      ))}
                      <div style={{width:1,height:16,background:AP.border}}/>
                      {/* Outcome filter */}
                      {[["all","Any outcome"],["correct","Both correct"],["lr_wrong","LR wrong"],["dt_wrong","DT wrong"],["both_wrong","Both wrong"]].map(([v,label])=>(
                        <button key={v} onClick={()=>setTxnOutcome(v)} style={{
                          padding:"3px 10px",borderRadius:5,border:`1px solid ${txnOutcome===v?AP.accent:AP.border}`,
                          background:txnOutcome===v?`${AP.accent}22`:"transparent",
                          color:txnOutcome===v?AP.accent:AP.muted,fontSize:11,fontWeight:600,cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Column headers — sortable */}
                  {(() => {
                    const SortBtn = ({col, label}) => {
                      const active = txnSort.col === col;
                      return (
                        <span onClick={()=>setTxnSort(s => s.col===col ? {col, dir:s.dir==="desc"?"asc":"desc"} : {col, dir:"desc"})}
                          style={{fontSize:11,fontWeight:600,color:active?AP.accent:AP.muted,letterSpacing:"0.06em",
                            textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}>
                          {label} <span style={{fontSize:9,opacity:active?1:0.4}}>{active?(txnSort.dir==="desc"?"▼":"▲"):"▼"}</span>
                        </span>
                      );
                    };

                    // Score selector — picks SMOTE or no-SMOTE pre-stored score
                    const tLrScore = t => lrSmoteApplied ? t.lrScore : t.lrScoreNS;
                    const tDtScore = t => dtSmoteApplied ? t.dtScore : t.dtScoreNS;

                    // Filter
                    const filtered = analysisResults.txns.map((t,i)=>({...t,_origIdx:i})).filter(t => {
                      const lrPred  = tLrScore(t) >= lrThreshApplied ? 1 : 0;
                      const dtPred  = tDtScore(t) >= dtThreshApplied ? 1 : 0;
                      const agree   = lrPred === dtPred;
                      const lrRight = lrPred === t.label;
                      const dtRight = dtPred === t.label;
                      if (txnFilter  === "fraud"      && t.label !== 1) return false;
                      if (txnFilter  === "legit"      && t.label !== 0) return false;
                      if (txnAgree   === "agree"      && !agree)         return false;
                      if (txnAgree   === "split"      && agree)          return false;
                      if (txnOutcome === "correct"    && !(lrRight && dtRight))  return false;
                      if (txnOutcome === "lr_wrong"   && lrRight)                return false;
                      if (txnOutcome === "dt_wrong"   && dtRight)                return false;
                      if (txnOutcome === "both_wrong" && (lrRight || dtRight))   return false;
                      return true;
                    });

                    // Sort
                    if (txnSort.col) {
                      filtered.sort((a,b) => {
                        const va = txnSort.col==="amt" ? a.amt : txnSort.col==="lr" ? tLrScore(a) : tDtScore(a);
                        const vb = txnSort.col==="amt" ? b.amt : txnSort.col==="lr" ? tLrScore(b) : tDtScore(b);
                        return txnSort.dir==="desc" ? vb-va : va-vb;
                      });
                    }

                    return (
                      <>
                        <div style={{fontSize:11,color:AP.muted,marginBottom:8}}>
                          {filtered.length} of {analysisResults.txns.length} transactions
                        </div>
                        <div className="table-scroll"><div style={{minWidth:650}}>
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
                        <div style={{maxHeight:360,overflowY:"auto"}}>
                        {filtered.map((t)=>{
                          const i = t._origIdx;
                      const lrPred = tLrScore(t) >= lrThreshApplied ? 1 : 0;
                      const dtPred = tDtScore(t) >= dtThreshApplied ? 1 : 0;
                      const agree  = lrPred === dtPred;
                      const lrRight= lrPred === t.label;
                      const dtRight= dtPred === t.label;
                      const isSelected = rq1Drawer === i;
                      return (
                        <div key={i}>
                        <div onClick={()=>{
                          const newSel = isSelected ? null : i;
                          setRq1Drawer(newSel);
                          if (newSel !== null) {
                            const _btypes = ['Big Box Retail','E-commerce','Electronics','Food & Beverage','Gas Station','Grocery','Pharmacy/Retail','Subscription','Transportation'];
                            const _bizType = _btypes.find(b => t[`business_type_${b}`] === 1) || 'Unknown';
                            const _msMap = [{k:'Marital_Status_Married',v:'Married'},{k:'Marital_Status_Single',v:'Single'},{k:'Marital_Status_Divorced',v:'Divorced'},{k:'Marital_Status_Unknown',v:'Unknown'}];
                            const _marital = _msMap.find(m => t[m.k] === 1)?.v || 'Unknown';
                            const _eduRevMap = {'-1':'Unknown','0':'Uneducated','1':'High School','2':'College','3':'Graduate','4':'Post-Graduate','5':'Doctorate'};
                            const _incRevMap = {'-1':'Unknown','0':'Less than $40K','1':'$40K - $60K','2':'$60K - $80K','3':'$80K - $120K','4':'$120K +'};
                            const _cardRevMap = {'-1':'Unknown','0':'Blue','1':'Silver','2':'Gold','3':'Platinum'};
                            const _approxYear = new Date().getFullYear() - Math.round(t.age || 40);
                            const features = {
                              amount: parseFloat(t.amt || 0),
                              lat: parseFloat(t.latitude || 0),
                              lng: parseFloat(t.longitude || 0),
                              date: t.is_weekend === 1 ? "2026-01-03" : "2026-01-07",
                              time: `${String(t.trans_hour || 12).padStart(2,'0')}:00`,
                              education_level: _eduRevMap[String(Math.round(t.Education_Level ?? -1))] || 'Unknown',
                              income_category: _incRevMap[String(Math.round(t.Income_Category ?? -1))] || 'Unknown',
                              card_category: _cardRevMap[String(Math.round(t.Card_Category ?? -1))] || 'Unknown',
                              marital_status: _marital,
                              business_type: _bizType,
                              months_on_book: parseInt(t.Months_on_book || 0),
                              birthday: `${_approxYear}-06-15`,
                            };
                            fetchExplain(features, i, tLrScore(t), tDtScore(t));
                          }
                        }}
                          style={{display:"grid",gridTemplateColumns:"0.5fr 1.2fr 0.8fr 0.6fr 80px 80px 70px 24px",
                          padding:"9px 14px",borderRadius:isSelected?"6px 6px 0 0":6,marginBottom:isSelected?0:2,
                          background: isSelected ? T.surfaceHi : t.label===1 ? `${AP.fraud}08` : "transparent",
                          border:`1px solid ${isSelected ? T.accent+"66" : t.label===1 ? T.fraudBdr : "transparent"}`,
                          alignItems:"center", cursor:"pointer", transition:"background 0.15s",
                          borderBottom: isSelected ? "none" : undefined}}
                          onMouseEnter={e=>{if(!isSelected){e.currentTarget.style.background=T.surfaceHi;}}}
                          onMouseLeave={e=>{if(!isSelected){e.currentTarget.style.background=t.label===1?`${AP.fraud}08`:"transparent";}}}>
                          <span style={{fontSize:11,color:AP.muted}}>{i+1}</span>
                          <span style={{fontSize:12,color:AP.text,fontWeight:500}}>{(['Big Box Retail','E-commerce','Electronics','Food & Beverage','Gas Station','Grocery','Pharmacy/Retail','Subscription','Transportation'].find(b=>t[`business_type_${b}`]===1))||'—'}</span>
                          <span style={{fontSize:12,color:AP.text}}>${Number(t.amt).toFixed(2)}</span>
                          <span style={{fontSize:11,fontWeight:700,color:t.label===1?T.fraud:AP.safe}}>
                            {t.label===1?"FRAUD":"LEGIT"}
                          </span>
                          <span style={{fontSize:12,fontWeight:600,color:lrRight?(t.label===1?T.fraud:T.safe):AP.amber}}>
                            {Math.round(tLrScore(t)*100)}%{lrRight?" ✓":" ✗"}
                          </span>
                          <span style={{fontSize:12,fontWeight:600,color:dtRight?(t.label===1?T.fraud:T.safe):AP.amber}}>
                            {Math.round(tDtScore(t)*100)}%{dtRight?" ✓":" ✗"}
                          </span>
                          <span style={{fontSize:11,fontWeight:600,color:agree?T.muted:AP.amber}}>
                            {agree?"✓ Agree":"✗ Split"}
                          </span>
                          <span style={{fontSize:12,color:AP.muted,textAlign:"center",transition:"transform 0.2s",
                            display:"inline-block",transform:isSelected?"rotate(90deg)":"rotate(0deg)"}}>›</span>
                        </div>

                        {/* ── Expandable detail panel ── */}
                        {isSelected && (()=>{
                          const feats = rq1Features[i];
                          const lrFeatures = feats?.lrFeatures || [];
                          const dtFeatures = feats?.dtFeatures || [];
                          const loading = !feats;
                          return (
                          <div style={{
                            background:"#111314", border:`1px solid ${T.accent+"66"}`,
                            borderTop:"none", borderRadius:"0 0 6px 6px",
                            padding:"16px 18px", marginBottom:2,
                          }}>
                            {/* Loading state */}
                            {loading && (
                              <div style={{fontSize:12, color:AP.muted, marginBottom:12, display:"flex", alignItems:"center", gap:8}}>
                                <span style={{animation:"themePulse 1s ease infinite", display:"inline-block", width:6, height:6, borderRadius:"50%", background:AP.accent}}/>
                                Loading feature explanations…
                              </div>
                            )}
                            {/* Model feature contributions from backend */}
                            {(lrFeatures.length > 0 || dtFeatures.length > 0) && (
                              <div style={{display:"flex", gap:12, marginBottom:16, flexWrap:"wrap"}}>
                                {lrFeatures.length > 0 && (
                                  <div style={{flex:1, minWidth:200, padding:"10px 14px", borderRadius:8,
                                    background:"#1a2744", border:"1px solid #3b82f688"}}>
                                    <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"#60a5fa", marginBottom:8}}>
                                      LR — TOP CONTRIBUTING FEATURES
                                    </div>
                                    {lrFeatures.map((f,fi)=>(
                                      <div key={fi} style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5, gap:8}}>
                                        <span style={{fontSize:11, color:"#93c5fd", flex:1}}>{f.feature}</span>
                                        <span style={{fontSize:11, fontWeight:700,
                                          color: f.contribution > 0 ? "#f87171" : "#4ade80",
                                          minWidth:50, textAlign:"right"}}>
                                          {f.contribution > 0 ? "+" : ""}{f.contribution.toFixed(3)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {dtFeatures.length > 0 && (
                                  <div style={{flex:1, minWidth:200, padding:"10px 14px", borderRadius:8,
                                    background:"#0f2318", border:`1px solid ${AP.safe}88`}}>
                                    <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:AP.safe, marginBottom:8}}>
                                      DT — DECISION PATH SPLITS
                                    </div>
                                    {dtFeatures.map((f,fi)=>(
                                      <div key={fi} style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5, gap:8}}>
                                        <span style={{fontSize:11, color:T.safe+"cc", flex:1}}>{f.feature}</span>
                                        <span style={{fontSize:11, fontWeight:700, color:AP.safe, minWidth:50, textAlign:"right"}}>
                                          Δ{f.contribution.toFixed(3)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Variable grid */}
                            {(()=>{
                              const _bt = ['Big Box Retail','E-commerce','Electronics','Food & Beverage','Gas Station','Grocery','Pharmacy/Retail','Subscription','Transportation'];
                              const _bizType = _bt.find(b=>t[`business_type_${b}`]===1) || '—';
                              const _ms = [{k:'Marital_Status_Married',v:'Married'},{k:'Marital_Status_Single',v:'Single'},{k:'Marital_Status_Divorced',v:'Divorced'},{k:'Marital_Status_Unknown',v:'Unknown'}];
                              const _marital = _ms.find(m=>t[m.k]===1)?.v || '—';
                              const _edu = {'-1':'Unknown','0':'Uneducated','1':'High School','2':'College','3':'Graduate','4':'Post-Graduate','5':'Doctorate'};
                              const _inc = {'-1':'Unknown','0':'< $40K','1':'$40K–$60K','2':'$60K–$80K','3':'$80K–$120K','4':'$120K+'};
                              const _card = {'-1':'Unknown','0':'Blue','1':'Silver','2':'Gold','3':'Platinum'};
                              const _day = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                              const rows = [
                                ["Amount",          `$${Number(t.amt).toFixed(2)}`],
                                ["Age",             `${Number(t.age||0).toFixed(1)} yrs`],
                                ["Trans Hour",      `${t.trans_hour ?? '—'}:00`],
                                ["Day of Week",     _day[t.trans_day_of_week] || '—'],
                                ["Latitude",        Number(t.latitude||0).toFixed(4)],
                                ["Longitude",       Number(t.longitude||0).toFixed(4)],
                                ["Card Category",   _card[String(Math.round(t.Card_Category??-1))] || '—'],
                                ["Income Category", _inc[String(Math.round(t.Income_Category??-1))] || '—'],
                                ["Education",       _edu[String(Math.round(t.Education_Level??-1))] || '—'],
                                ["Marital Status",  _marital],
                                ["Business Type",   _bizType],
                                ["Months on Book",  t.Months_on_book ?? '—'],
                                ["High Amount",     t.is_high_amt===1 ? "Yes (>$188)" : "No"],
                                ["Night Txn",       t.is_night===1 ? "Yes (10pm–5am)" : "No"],
                                ["Weekend",         t.is_weekend===1 ? "Yes" : "No"],
                                ["New Customer",    t.new_customer===1 ? "Yes (<12 mo)" : "No"],
                                ["True Label",      t.label===1 ? "FRAUD" : "LEGIT"],
                                ["LR Score",        `${Math.round(tLrScore(t)*100)}% → ${tLrScore(t)>=lrThreshApplied?"FRAUD":"LEGIT"}`],
                                ["DT Score",        `${Math.round(tDtScore(t)*100)}% → ${tDtScore(t)>=dtThreshApplied?"FRAUD":"LEGIT"}`],
                              ];
                              return (
                                <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px 24px"}}>
                                  {rows.map(([label, val])=>(
                                    <div key={label} style={{display:"flex",flexDirection:"column",gap:2}}>
                                      <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.08em",color:AP.muted,textTransform:"uppercase"}}>{label}</span>
                                      <span style={{fontSize:12,
                                        color: label==="True Label" ? (t.label===1?T.fraud:T.safe) : label==="LR Score" ? "#60a5fa" : label==="DT Score" ? T.safe : T.text,
                                        fontWeight: label==="True Label"||label.includes("Score") ? 600 : 400}}>
                                        {String(val)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                          );
                        })()}
                        </div>
                      );
                        })}
                        </div>
                        </div></div>
                      </>
                    );
                  })()}
                </div>

              </div>
            );
          })()}

        </div>
        );
        })()} {/* end activeTab === analysis */}


        {activeTab === "rq" && (() => {
          const AP = PURPLE;

          // ── Helpers ──────────────────────────────────────────────────────────
          function computeMetrics(scores, labels, thresh) {
            let tp=0,fp=0,tn=0,fn=0;
            (scores||[]).forEach((s,i) => {
              const pred = s >= thresh ? 1 : 0;
              if (pred===1 && labels[i]===1) tp++;
              else if (pred===1 && labels[i]===0) fp++;
              else if (pred===0 && labels[i]===0) tn++;
              else fn++;
            });
            const precision = tp+fp>0 ? tp/(tp+fp) : 0;
            const recall    = tp+fn>0 ? tp/(tp+fn) : 0;
            const f1        = precision+recall>0 ? 2*precision*recall/(precision+recall) : 0;
            const accuracy  = (tp+tn+fp+fn)>0 ? (tp+tn)/(tp+fp+tn+fn) : 0;
            return { tp, fp, tn, fn, precision, recall, f1, accuracy };
          }

          const hasData = analysisResults && analysisResults.lrScores && analysisResults.dtScores;
          const ts = analysisResults?.testScores;
          const lrM50 = hasData ? computeMetrics(ts?.lr_no_smote_scores||analysisResults.lrScores, ts?.lr_no_smote_labels||analysisResults.labels, rq1LrThreshold) : null;
          const dtM50 = hasData ? computeMetrics(ts?.dt_no_smote_scores||analysisResults.dtScores, ts?.dt_no_smote_labels||analysisResults.labels, rq1DtThreshold) : null;

          // Behavioral stats from transaction data
          const txns = analysisResults?.txns || [];
          const spikeFraudRate  = txns.length ? (() => {
            const spikes = txns.filter(t => t.is_high_amt === 1);
            return spikes.length > 0 ? spikes.filter(t=>t.label===1).length/spikes.length : 0;
          })() : 0;
          const noSpikeFraudRate = txns.length ? (() => {
            const nonSpikes = txns.filter(t => t.is_high_amt !== 1);
            return nonSpikes.length > 0 ? nonSpikes.filter(t=>t.label===1).length/nonSpikes.length : 0;
          })() : 0;
          const offHourFraud = txns.length ? (() => {
            const off = txns.filter(t => t.is_night === 1);
            return off.length > 0 ? off.filter(t=>t.label===1).length/off.length : 0;
          })() : 0;
          const onHourFraud = txns.length ? (() => {
            const on = txns.filter(t => t.is_night !== 1);
            return on.length > 0 ? on.filter(t=>t.label===1).length/on.length : 0;
          })() : 0;

          // Threshold sweep for RQ3 — use pre-computed memoized values
          const sweepThresholds = Array.from({length:91},(_,i)=>parseFloat((0.05+i*0.01).toFixed(2)));
          const lrSweep = lrSweepMemo;
          const dtSweep = dtSweepMemo;

          // SMOTE stats from backend metrics
          const lrMetrics = analysisResults?.lrMetrics;
          const dtMetrics = analysisResults?.dtMetrics;

          const subTabs = [
            {id:"rq1", label:"RQ1 — Model Comparison"},
            {id:"rq2", label:"RQ2 — Behavioral Features"},
            {id:"rq3", label:"RQ3 — Imbalance & Threshold"},
            {id:"summary", label:"Summary"},
          ];

          const sectionHead = (title, sub) => (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:700,color:AP.text,marginBottom:4}}>{title}</div>
              <div style={{fontSize:13,color:AP.muted}}>{sub}</div>
            </div>
          );

          const noDataBanner = (
            <div style={{padding:"48px 0",textAlign:"center",color:AP.muted}}>
              <div style={{fontSize:32,marginBottom:12}}>◎</div>
              <div style={{fontSize:14,marginBottom:12,color:AP.text}}>
                {analysisRunning ? "Loading analysis data…" : "No analysis data loaded yet"}
              </div>
              {analysisRunning ? (
                <div style={{fontSize:12,color:AP.muted}}>Fetching test set and scoring both models…</div>
              ) : (
                <button onClick={()=>runAnalysis()} style={{
                  padding:"10px 28px",borderRadius:10,border:"none",cursor:"pointer",
                  background:`linear-gradient(135deg,${AP.accent},${AP.accentDim})`,
                  color:"#fff",fontWeight:700,fontSize:14,fontFamily:"'DM Sans',sans-serif",
                  boxShadow:`0 0 20px ${AP.accentGlow}`,
                }}>▶ Load Analysis</button>
              )}
            </div>
          );

          return (
            <div style={{maxWidth:1060,margin:"0 auto",zIndex:1,animation:"fadeUp 0.3s ease"}}>

              {/* Sub-tab nav */}
              <div style={{display:"flex",gap:4,background:AP.surface,border:`1px solid ${AP.border}`,borderRadius:12,padding:6,marginBottom:20}}>
                {subTabs.map(({id,label})=>(
                  <button key={id} onClick={()=>setRqTab(id)} style={{
                    flex:1,padding:"10px 16px",borderRadius:8,border:"none",cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,
                    background: rqTab===id ? `linear-gradient(135deg,${AP.accentDim},${AP.accent}44)` : "transparent",
                    color: rqTab===id ? AP.accent : AP.muted,
                    transition:"all 0.2s",
                    boxShadow: rqTab===id ? `0 0 14px ${AP.accentGlow}` : "none",
                    borderBottom: rqTab===id ? `2px solid ${AP.accent}` : "2px solid transparent",
                  }}>{label}</button>
                ))}
              </div>

              {/* ══════ RQ1 ══════ */}
              {rqTab === "rq1" && (
                <div style={{display:"grid",gap:16,animation:"fadeUp 0.25s ease"}}>
                  {sectionHead("RQ1 — Which model better balances fraud detection and false positive reduction?",
                    "Compare Logistic Regression vs. Decision Tree — drag the sliders to set each model's decision threshold")}

                  <div style={{padding:"8px 14px",borderRadius:8,background:"#1a1f2e",border:"1px solid #334",display:"flex",alignItems:"center",gap:8,marginTop:-8}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6b7280"}}>Note</span>
                    <span style={{fontSize:12,color:"#9ca3af"}}>SMOTE is not applied here — both models are evaluated on the held-out test set without oversampling</span>
                  </div>

                  {/* Per-model threshold sliders */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div style={{borderRadius:10,border:`1px solid ${THEMES.logistic_regression.accent}33`,padding:"12px 16px",background:`${THEMES.logistic_regression.accent}08`}}>
                      <div style={{fontSize:10,fontWeight:600,color:THEMES.logistic_regression.accent,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6}}>
                        Logistic Regression Threshold — {Math.round(rq1LrThreshold*100)}%
                      </div>
                      <input type="range" min={0} max={1} step={0.01} value={rq1LrThreshold}
                        onChange={e=>setRq1LrThreshold(parseFloat(e.target.value))}
                        style={{width:"100%",accentColor:THEMES.logistic_regression.accent}}/>
                    </div>
                    <div style={{borderRadius:10,border:`1px solid ${THEMES.decision_tree.accent}33`,padding:"12px 16px",background:`${THEMES.decision_tree.accent}08`}}>
                      <div style={{fontSize:10,fontWeight:600,color:THEMES.decision_tree.accent,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6}}>
                        Decision Tree Threshold — {Math.round(rq1DtThreshold*100)}%
                      </div>
                      <input type="range" min={0} max={1} step={0.01} value={rq1DtThreshold}
                        onChange={e=>setRq1DtThreshold(parseFloat(e.target.value))}
                        style={{width:"100%",accentColor:THEMES.decision_tree.accent}}/>
                    </div>
                  </div>

                  {!hasData ? noDataBanner : (() => {
                    const rows = [
                      {name:"Logistic Regression", m:lrM50, accent:THEMES.logistic_regression.accent, t:rq1LrThreshold},
                      {name:"Decision Tree",       m:dtM50, accent:THEMES.decision_tree.accent,        t:rq1DtThreshold},
                    ];
                    const dtWins = dtM50.f1 >= lrM50.f1;

                    return (<>
                      {/* Metric comparison cards */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        {rows.map(({name,m,accent,t})=>(
                          <div key={name} style={{background:AP.tag,border:`1px solid ${accent}44`,borderRadius:14,padding:"20px 22px"}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <div style={{width:8,height:8,borderRadius:"50%",background:accent}}/>
                                <span style={{fontSize:13,fontWeight:700,color:accent,letterSpacing:"0.04em"}}>{name}</span>
                              </div>
                              <span style={{fontSize:11,fontWeight:600,color:AP.muted,padding:"2px 8px",borderRadius:5,background:AP.surfaceHi,border:`1px solid ${AP.border}`}}>
                                t = {t.toFixed(2)}
                              </span>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                              {[
                                {label:"Precision", val:(m.precision*100).toFixed(1)+"%"},
                                {label:"Recall",    val:(m.recall*100).toFixed(1)+"%"},
                                {label:"F1-Score",  val:(m.f1*100).toFixed(1)+"%"},
                                {label:"Accuracy",  val:(m.accuracy*100).toFixed(1)+"%"},
                              ].map(({label,val})=>(
                                <div key={label} style={{background:AP.surfaceHi,borderRadius:8,padding:"10px 12px",border:`1px solid ${AP.border}`}}>
                                  <div style={{fontSize:10,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:4}}>{label}</div>
                                  <div style={{fontSize:22,fontWeight:700,color:label==="F1-Score"?accent:AP.text,fontFamily:"'DM Serif Display',serif"}}>{val}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              {[
                                {label:"Fraud Caught (TP)", val:m.tp, color:accent},
                                {label:"Fraud Missed (FN)", val:m.fn, color:AP.fraud},
                                {label:"False Alarms (FP)", val:m.fp, color:AP.amber},
                                {label:"Legit Approved (TN)", val:m.tn, color:AP.safe},
                              ].map(({label,val,color})=>(
                                <div key={label} style={{background:AP.surface,borderRadius:7,padding:"8px 10px",border:`1px solid ${AP.border}`}}>
                                  <div style={{fontSize:10,color:AP.muted,marginBottom:2}}>{label}</div>
                                  <div style={{fontSize:20,fontWeight:700,color,fontFamily:"'DM Serif Display',serif"}}>{val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Winner banner */}
                      {(() => {
                        const winnerAccent = dtWins ? THEMES.decision_tree.accent : THEMES.logistic_regression.accent;
                        const winnerName   = dtWins ? "Decision Tree" : "Logistic Regression";
                        const winnerT      = dtWins ? rq1DtThreshold : rq1LrThreshold;
                        const loserT       = dtWins ? rq1LrThreshold : rq1DtThreshold;
                        const winnerM      = dtWins ? dtM50 : lrM50;
                        const loserM       = dtWins ? lrM50 : dtM50;
                        const totalFraud   = lrM50.tp + lrM50.fn;
                        return (
                          <div style={{background:`${winnerAccent}18`,border:`1px solid ${winnerAccent}44`,
                            borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                            <div style={{fontSize:28}}>🏆</div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:winnerAccent,marginBottom:3}}>
                                {winnerName} achieves higher F1 at t = {winnerT.toFixed(2)}
                              </div>
                              <div style={{fontSize:12,color:AP.muted}}>
                                F1: <strong style={{color:winnerAccent}}>{(winnerM.f1*100).toFixed(1)}%</strong> (t={winnerT.toFixed(2)}) vs {(loserM.f1*100).toFixed(1)}% (t={loserT.toFixed(2)}) —
                                catches {winnerM.tp} vs {loserM.tp} fraud cases out of {totalFraud} total
                              </div>
                              <div style={{fontSize:11,color:AP.muted,marginTop:4}}>
                                LR precision: {(lrM50.precision*100).toFixed(1)}% / recall: {(lrM50.recall*100).toFixed(1)}% ·
                                DT precision: {(dtM50.precision*100).toFixed(1)}% / recall: {(dtM50.recall*100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Feature importance bar (from top features) */}
                      <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:14,padding:"20px 22px"}}>
                        <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:14}}>
                          Decision Tree — Top Feature Importances
                        </div>
                        {[
                          {name:"amt (transaction amount)",    pct:64.0},
                          {name:"amt_log (log-scaled amount)", pct:33.1},
                          {name:"Marital_Status_Married",      pct:0.9},
                          {name:"business_type_Gas Station",   pct:0.7},
                        ].map(({name,pct})=>(
                          <div key={name} style={{marginBottom:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                              <span style={{fontSize:12,color:AP.text}}>{name}</span>
                              <span style={{fontSize:12,fontWeight:700,color:THEMES.decision_tree.accent}}>{pct}%</span>
                            </div>
                            <div style={{height:6,borderRadius:6,background:AP.surfaceHi,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:6,width:`${pct}%`,
                                background:`linear-gradient(90deg,${THEMES.decision_tree.accentDim},${THEMES.decision_tree.accent})`,
                                boxShadow:`0 0 8px ${THEMES.decision_tree.accent}66`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>);
                  })()}
                </div>
              )}

              {/* ══════ RQ2 ══════ */}
              {rqTab === "rq2" && (
                <div style={{display:"grid",gap:16,animation:"fadeUp 0.25s ease"}}>
                  {sectionHead("RQ2 — Do behavioral features improve fraud detection?",
                    "High Amount Flag (top 5% of transactions > $188), Night Transaction (10pm–5am), Spatial Velocity")}

                  {!hasData ? noDataBanner : (() => {
                    const features = [
                      {
                        name:"High Amount Flag (is_high_amt)",
                        desc:"Transaction amount in top 5% of dataset (> $188)",
                        presentRate: 0.404,
                        absentRate:  0.046,
                        color: "#f87171",
                        importance: "amt & amt_log are #1 & #2 DT features (64% + 33%)",
                        engineered: true,
                      },
                      {
                        name:"Monthly Spend Ratio (amt_per_month)",
                        desc:"Transaction amount relative to client's average monthly spending",
                        presentRate: 0.1553,
                        absentRate:  0.0166,
                        color: "#c084fc",
                        importance: "Strong behavioral signal — 9.4× higher fraud rate when flagged",
                        engineered: true,
                      },
                      {
                        name:"Night Transaction (is_night)",
                        desc:"Transaction between 10pm and 5am",
                        presentRate: 0.405,
                        absentRate:  0.331,
                        color: AP.amber,
                        importance: "Weak directional signal — 1.2× uplift; low DT importance",
                        engineered: true,
                      },
                      {
                        name:"Spatial Velocity",
                        desc:"Travel speed > 900 km/h between consecutive transactions from same client",
                        presentRate: null,
                        absentRate:  null,
                        color: "#f87171",
                        importance: "Runtime rule — overrides score to 1.0",
                        engineered: true,
                        liveDetections: log.filter(e=>e.impossibleTravel).length,
                      },
                    ];

                    return (<>
                      {/* Feature cards */}
                      <div className="rq2-feature-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        {features.map(f=>(
                          <div key={f.name} style={{background:AP.tag,border:`1px solid ${f.engineered?f.color+"33":AP.tagBorder}`,borderRadius:14,padding:"18px 20px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <div style={{width:8,height:8,borderRadius:"50%",background:f.engineered?f.color:AP.muted,
                                boxShadow:f.engineered?`0 0 8px ${f.color}`:""}}/>
                              <span style={{fontSize:13,fontWeight:700,color:f.engineered?f.color:AP.muted}}>{f.name}</span>
                            </div>
                            <div style={{fontSize:11,color:AP.muted,marginBottom:14,lineHeight:1.5}}>{f.desc}</div>

                            {f.presentRate !== null ? (<>
                              {/* Bar comparison */}
                              {[
                                {label:"Flag = 1 (present)", rate:f.presentRate, color:f.color},
                                {label:"Flag = 0 (absent)",  rate:f.absentRate,  color:AP.safe},
                              ].map(({label,rate,color})=>(
                                <div key={label} style={{marginBottom:10}}>
                                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                                    <span style={{fontSize:10,color:AP.muted}}>{label}</span>
                                    <span style={{fontSize:12,fontWeight:700,color}}>{(rate*100).toFixed(2)}%</span>
                                  </div>
                                  <div style={{height:8,borderRadius:6,background:AP.surfaceHi,overflow:"hidden"}}>
                                    <div style={{height:"100%",borderRadius:6,
                                      width:`${Math.min(rate*100*8,100)}%`,
                                      background:`linear-gradient(90deg,${color}66,${color})`,
                                      transition:"width 0.8s ease"}}/>
                                  </div>
                                </div>
                              ))}
                              <div style={{marginTop:10,padding:"6px 10px",borderRadius:7,
                                background:AP.surfaceHi,border:`1px solid ${AP.border}`,fontSize:11,color:AP.muted}}>
                                Uplift: <strong style={{color:f.color}}>
                                  {f.absentRate>0?(f.presentRate/f.absentRate).toFixed(1):"∞"}×
                                </strong> higher fraud rate when flagged
                              </div>
                            </>) : f.liveDetections !== undefined ? (
                              <div style={{padding:"12px 0"}}>
                                <div style={{padding:"10px 12px",borderRadius:7,
                                  background:"#3b0a0a44",border:"1px solid #f8717144",
                                  display:"flex",alignItems:"center",gap:10}}>
                                  <span style={{fontSize:20}}>✈</span>
                                  <div>
                                    <div style={{fontSize:18,fontWeight:700,color:"#f87171",fontFamily:"'DM Serif Display',serif"}}>
                                      {f.liveDetections}
                                    </div>
                                    <div style={{fontSize:10,color:AP.muted,marginTop:1}}>
                                      impossible travel {f.liveDetections===1?"detection":"detections"} in live log
                                    </div>
                                  </div>
                                </div>
                                <div style={{marginTop:8,fontSize:11,color:AP.muted,lineHeight:1.5}}>
                                  Implemented as inference-time rule. Cannot be evaluated on the static test set — requires sequential client history.
                                </div>
                              </div>
                            ) : (
                              <div style={{padding:"20px 0",textAlign:"center",color:AP.muted,fontSize:12}}>
                                Not computable with this dataset
                              </div>
                            )}

                            <div style={{marginTop:12,padding:"6px 10px",borderRadius:7,
                              background:f.engineered?`${f.color}11`:AP.surfaceHi,
                              border:`1px solid ${f.engineered?f.color+"33":AP.border}`,
                              fontSize:10,color:f.engineered?f.color:AP.muted,fontWeight:600}}>
                              {f.importance}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bar chart: fraud rate by feature */}
                      <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:14,padding:"20px 22px"}}>
                        <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:16}}>
                          Fraud Rate — Flag Present vs. Absent
                        </div>
                        {(() => {
                          const W=620, H=200, pad=50, bw=60, gap=20;
                          const bars = [
                            {label:"High Amt\nPresent",  rate:0.404,  color:"#f87171"},
                            {label:"High Amt\nAbsent",   rate:0.046,  color:AP.safe},
                            {label:"Amt/Month\nPresent", rate:0.1553, color:"#c084fc"},
                            {label:"Amt/Month\nAbsent",  rate:0.0166, color:AP.safe},
                            {label:"Night\nPresent",     rate:0.405,  color:AP.amber},
                            {label:"Night\nAbsent",      rate:0.331,  color:AP.safe},
                          ];
                          const maxRate = Math.max(...bars.map(b=>b.rate), 0.07);
                          const chartH = H - pad*2;
                          return (
                            <div className="chart-scroll"><svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto"}}>
                              {[0,0.10,0.20,0.30,0.40].map(v=>(
                                <g key={v}>
                                  <line x1={pad} y1={H-pad-(v/maxRate)*chartH} x2={W-20} y2={H-pad-(v/maxRate)*chartH} stroke={AP.border} strokeWidth={0.5}/>
                                  <text x={pad-4} y={H-pad-(v/maxRate)*chartH+4} fontSize={8} fill={AP.muted} textAnchor="end">{(v*100).toFixed(0)}%</text>
                                </g>
                              ))}
                              {bars.map((b,i)=>{
                                const x = pad + i*(bw+gap);
                                const barH = (b.rate/maxRate)*chartH;
                                return (
                                  <g key={i}>
                                    <rect x={x} y={H-pad-barH} width={bw} height={barH} fill={b.color} opacity={0.8} rx={4}/>
                                    <text x={x+bw/2} y={H-pad-barH-4} fontSize={9} fill={b.color} textAnchor="middle" fontWeight="700">{(b.rate*100).toFixed(2)}%</text>
                                    {b.label.split("\n").map((line,li)=>(
                                      <text key={li} x={x+bw/2} y={H-pad+14+li*11} fontSize={8} fill={AP.muted} textAnchor="middle">{line}</text>
                                    ))}
                                  </g>
                                );
                              })}
                            </svg></div>
                          );
                        })()}
                      </div>

                      {/* Interpretation */}
                      <div style={{background:AP.surface,border:`1px solid ${AP.border}`,borderRadius:14,padding:"20px 22px"}}>
                        <div style={{fontSize:13,fontWeight:600,color:AP.text,marginBottom:10}}>Interpretation</div>
                        <div style={{fontSize:13,color:AP.muted,lineHeight:1.7}}>
                          <strong style={{color:"#f87171"}}>High Amount Flag (is_high_amt)</strong> shows a fraud rate of{" "}
                          <strong style={{color:"#f87171"}}>40.4%</strong> when flagged vs{" "}
                          <strong style={{color:AP.safe}}>4.6%</strong> when absent —
                          an <strong style={{color:AP.text}}>8.7×</strong> uplift.
                          The Decision Tree's top two features are amount-based: <code style={{color:AP.accent,fontSize:12}}>amt</code> (64.0%) and <code style={{color:AP.accent,fontSize:12}}>amt_log</code> (33.1%) —
                          log-scaling captures diminishing-returns at high spend that raw amount alone misses.
                          {" "}<strong style={{color:"#c084fc"}}>Monthly Spend Ratio (amt_per_month)</strong> shows a fraud rate of{" "}
                          <strong style={{color:"#c084fc"}}>15.53%</strong> when flagged vs{" "}
                          <strong style={{color:AP.safe}}>1.66%</strong> when absent —
                          a <strong style={{color:AP.text}}>9.4×</strong> uplift, making it the strongest behavioral signal relative to baseline.
                          {" "}<strong style={{color:AP.amber}}>Night transactions (is_night)</strong> (10pm–5am) show a{" "}
                          <strong style={{color:AP.amber}}>40.5%</strong> fraud rate vs{" "}
                          <strong style={{color:AP.safe}}>33.1%</strong> during other hours — a modest <strong style={{color:AP.text}}>1.2×</strong> uplift, indicating a weak directional signal.
                          {" "}<strong style={{color:"#f87171"}}>Spatial velocity</strong> is implemented as an inference-time rule: the backend overrides any model score to 1.0 when the computed travel speed between a client's consecutive transactions exceeds 900 km/h —
                          a threshold no legitimate cardholder can cross. Adding behavioral features improved LR ROC-AUC from 0.33 to 0.93.
                        </div>
                      </div>
                    </>);
                  })()}
                </div>
              )}

              {/* ══════ RQ3 ══════ */}
              {rqTab === "rq3" && (
                <div style={{display:"grid",gap:16,animation:"fadeUp 0.25s ease"}}>
                  {sectionHead("RQ3 — How do class imbalance handling and threshold adjustment influence effectiveness?",
                    "SMOTE oversampling (42 → 3,958 fraud cases) + threshold sweep 0.05 → 0.95")}

                  {!hasData ? noDataBanner : (() => {

                    // SMOTE comparison data — "No SMOTE" values are hardcoded from Python script output
                    // (backend only holds scores for SMOTE-trained models); "SMOTE + Opt." uses live sweep
                    const _lrBestIdx = lrSweep.indexOf(lrSweep.reduce((b,m)=>m.f1>b.f1?m:b, lrSweep[0]||{f1:0}));
                    const _dtBestIdx = dtSweep.indexOf(dtSweep.reduce((b,m)=>m.f1>b.f1?m:b, dtSweep[0]||{f1:0}));
                    const _lrOpt = lrSweep[_lrBestIdx] || {};
                    const _dtOpt = dtSweep[_dtBestIdx] || {};
                    const smoteRows = [
                      {model:"Logistic Regression",  noSmoteRecall:0.10, noSmoteF1:0.1538, noSmoteT:0.50, smoteRecall:_lrOpt.recall??0.60, smoteF1:_lrOpt.f1??0.2449, accent:THEMES.logistic_regression.accent, noSmoteColor:AP.fraud, smoteColor:THEMES.logistic_regression.accent},
                      {model:"Decision Tree",        noSmoteRecall:0.60, noSmoteF1:0.4290, noSmoteT:0.20, smoteRecall:_dtOpt.recall??0.40, smoteF1:_dtOpt.f1??0.2759, accent:THEMES.decision_tree.accent,       noSmoteColor:AP.safe,  smoteColor:AP.fraud},
                    ];

                    // F1 line chart across thresholds
                    const ThresholdChart = () => {
                      const [hoverId, setHoverId] = useState(null);
                      const W=620,H=230,padL=45,padB=30,padT=20,padR=175;
                      const cW = W-padL-padR, cH = H-padB-padT;
                      const toX = i => padL + (i/(sweepThresholds.length-1))*cW;
                      const toY = v => padT + (1-v)*cH;
                      const lrF1  = lrSweep.map(m=>m.f1);
                      const dtF1  = dtSweep.map(m=>m.f1);
                      const lrRec = lrSweep.map(m=>m.recall);
                      const dtRec = dtSweep.map(m=>m.recall);
                      const mkPath = arr => "M"+arr.map((v,i)=>`${toX(i)},${toY(v)}`).join(" L");
                      const lrBest = lrF1.indexOf(Math.max(...lrF1));
                      const dtBest = dtF1.indexOf(Math.max(...dtF1));
                      const t50Idx = sweepThresholds.findIndex(t=>Math.abs(t-0.5)<0.001);
                      const t20Idx = sweepThresholds.findIndex(t=>Math.abs(t-0.20)<0.001);
                      const t81Idx = sweepThresholds.findIndex(t=>Math.abs(t-0.81)<0.001);
                      const lrAcc = THEMES.logistic_regression.accent;
                      const dtAcc = THEMES.decision_tree.accent;

                      // No-SMOTE reference values (hardcoded from Python output)
                      const nsPoints = [
                        {id:"lr-ns",   label:"LR No SMOTE (t=0.50)", f1:0.1538, recall:0.10, thresh:0.50, accent:lrAcc, cx:toX(t50Idx), cy:toY(0.1538)},
                        {id:"lr-ns81", label:"LR No SMOTE (t=0.81)", f1:0.182,  recall:0.10, thresh:0.81, accent:lrAcc, cx:toX(t81Idx), cy:toY(0.182)},
                        {id:"dt-ns",   label:"DT No SMOTE (t=0.20)", f1:0.429,  recall:0.60, thresh:0.20, accent:dtAcc, cx:toX(t20Idx), cy:toY(0.429)},
                      ];
                      const optPoints = [
                        {id:"lr-opt", label:"LR SMOTE Optimal", f1:lrF1[lrBest], recall:lrRec[lrBest], thresh:sweepThresholds[lrBest], accent:lrAcc, cx:toX(lrBest), cy:toY(lrF1[lrBest])},
                        {id:"dt-opt", label:"DT SMOTE Optimal", f1:dtF1[dtBest], recall:dtRec[dtBest], thresh:sweepThresholds[dtBest], accent:dtAcc, cx:toX(dtBest), cy:toY(dtF1[dtBest])},
                      ];

                      const Tooltip = ({cx, cy, label, f1, recall, thresh, accent}) => {
                        const tw=122, th=58, pad=7;
                        const tx = cx+tw+12 > W-padR ? cx-tw-8 : cx+8;
                        const ty = Math.max(padT, Math.min(cy-th/2, H-padB-th));
                        return (
                          <g pointerEvents="none">
                            <rect x={tx} y={ty} width={tw} height={th} rx={5} fill="#12161f" stroke={accent} strokeWidth={1} opacity={0.97}/>
                            <text x={tx+pad} y={ty+13} fontSize={8} fill={accent} fontWeight={700}>{label}</text>
                            <text x={tx+pad} y={ty+26} fontSize={8} fill={AP.muted}>Threshold: <tspan fill={AP.text} fontWeight={600}>{thresh?.toFixed(2)}</tspan></text>
                            <text x={tx+pad} y={ty+38} fontSize={8} fill={AP.muted}>F1-Score: <tspan fill={accent} fontWeight={700}>{(f1*100).toFixed(1)}%</tspan></text>
                            <text x={tx+pad} y={ty+50} fontSize={8} fill={AP.muted}>Recall: <tspan fill={accent} fontWeight={700}>{(recall*100).toFixed(1)}%</tspan></text>
                          </g>
                        );
                      };

                      return (
                        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",overflow:"visible"}}>
                          {/* Grid */}
                          {[0,0.2,0.4,0.6,0.8,1].map(v=>(
                            <g key={v}>
                              <line x1={padL} y1={toY(v)} x2={W-padR} y2={toY(v)} stroke={AP.border} strokeWidth={0.5}/>
                              <text x={padL-4} y={toY(v)+3} fontSize={7} fill={AP.muted} textAnchor="end">{Math.round(v*100)}%</text>
                            </g>
                          ))}
                          {sweepThresholds.map((t,i)=> Math.round(t*100)%10===0 ? (
                            <text key={i} x={toX(i)} y={H-4} fontSize={7} fill={AP.muted} textAnchor="middle">{Math.round(t*100)}%</text>
                          ) : null)}
                          {/* No-SMOTE horizontal reference lines */}
                          <line x1={padL} y1={toY(0.1538)} x2={W-padR} y2={toY(0.1538)} stroke={lrAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.35}/>
                          <line x1={padL} y1={toY(0.4211)} x2={W-padR} y2={toY(0.4211)} stroke={dtAcc} strokeWidth={1} strokeDasharray="2,4" opacity={0.35}/>
                          {/* SMOTE lines */}
                          <path d={mkPath(lrRec)} fill="none" stroke={lrAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <path d={mkPath(lrF1)}  fill="none" stroke={lrAcc} strokeWidth={2.5}/>
                          <path d={mkPath(dtRec)} fill="none" stroke={dtAcc} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.5}/>
                          <path d={mkPath(dtF1)}  fill="none" stroke={dtAcc} strokeWidth={2.5}/>
                          {/* No-SMOTE diamond dots at t=0.50 */}
                          {nsPoints.map(p=>(
                            <g key={p.id} style={{cursor:"pointer"}}
                              onMouseEnter={()=>setHoverId(p.id)} onMouseLeave={()=>setHoverId(null)}>
                              <polygon
                                points={`${p.cx},${p.cy-6} ${p.cx+6},${p.cy} ${p.cx},${p.cy+6} ${p.cx-6},${p.cy}`}
                                fill={p.accent} stroke={AP.surface} strokeWidth={1.5} opacity={hoverId===p.id?1:0.75}/>
                              <circle cx={p.cx} cy={p.cy} r={10} fill="transparent"/>
                            </g>
                          ))}
                          {/* SMOTE optimal circle dots */}
                          {optPoints.map(p=>(
                            <g key={p.id} style={{cursor:"pointer"}}
                              onMouseEnter={()=>setHoverId(p.id)} onMouseLeave={()=>setHoverId(null)}>
                              <circle cx={p.cx} cy={p.cy} r={hoverId===p.id?7:5} fill={p.accent} stroke={AP.surface} strokeWidth={2} style={{transition:"r 0.1s"}}/>
                              <circle cx={p.cx} cy={p.cy} r={10} fill="transparent"/>
                            </g>
                          ))}
                          {/* Tooltips (rendered last so they appear on top) */}
                          {[...nsPoints,...optPoints].map(p=> hoverId===p.id
                            ? <Tooltip key={p.id} {...p}/> : null)}
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
                          <text x={padL+cW/2} y={H-1} fontSize={8} fill={AP.muted} textAnchor="middle">Classification Threshold</text>
                          <text x={8} y={padT+cH/2} fontSize={8} fill={AP.muted} textAnchor="middle" transform={`rotate(-90,8,${padT+cH/2})`}>Score</text>
                        </svg>
                      );
                    };

                    return (<>
                      {/* SMOTE impact cards */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        {smoteRows.map(s=>(
                          <div key={s.model} style={{background:AP.tag,border:`1px solid ${s.accent}33`,borderRadius:14,padding:"18px 20px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                              <div style={{width:8,height:8,borderRadius:"50%",background:s.accent}}/>
                              <span style={{fontSize:13,fontWeight:700,color:s.accent}}>{s.model} — SMOTE Impact</span>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              {[
                                {label:`No SMOTE (t=${s.noSmoteT.toFixed(2)}) — Recall`, val:s.noSmoteRecall, color:s.noSmoteColor},
                                {label:`No SMOTE (t=${s.noSmoteT.toFixed(2)}) — F1`,     val:s.noSmoteF1,    color:s.noSmoteColor},
                                {label:`SMOTE + Opt. (t=${sweepThresholds[s.model==="Logistic Regression"?_lrBestIdx:_dtBestIdx]?.toFixed(2)}) — Recall`, val:s.smoteRecall, color:s.smoteColor},
                                {label:`SMOTE + Opt. (t=${sweepThresholds[s.model==="Logistic Regression"?_lrBestIdx:_dtBestIdx]?.toFixed(2)}) — F1`,     val:s.smoteF1,    color:s.smoteColor},
                              ].map(({label,val,color})=>(
                                <div key={label} style={{background:AP.surfaceHi,borderRadius:8,padding:"10px 12px",border:`1px solid ${AP.border}`}}>
                                  <div style={{fontSize:9,color:AP.muted,marginBottom:3,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</div>
                                  <div style={{fontSize:20,fontWeight:700,color,fontFamily:"'DM Serif Display',serif"}}>{(val*100).toFixed(1)}%</div>
                                </div>
                              ))}
                            </div>
                            <div style={{marginTop:10,padding:"7px 10px",borderRadius:7,
                              background:`${s.accent}11`,border:`1px solid ${s.accent}33`,fontSize:11,color:s.accent,fontWeight:600}}>
                              {s.model === "Logistic Regression"
                              ? `Recall ↑ ${((s.smoteRecall/s.noSmoteRecall)*100-100).toFixed(0)}% — SMOTE + threshold tuning transforms LR`
                              : "DT had 40% recall baseline; SMOTE + threshold tuning recovers it"}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Threshold sweep chart */}
                      <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:14,padding:"20px 22px"}}>
                        <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:14}}>
                          F1 &amp; Recall Across Thresholds — Both Models
                        </div>
                        <div className="chart-scroll"><ThresholdChart/></div>
                        <div style={{fontSize:11,color:AP.muted,marginTop:8}}>
                          Solid lines = F1-Score (SMOTE). Dashed lines = Recall (SMOTE). Faint dotted horizontals = No-SMOTE F1 baseline. Hover dots for details.
                        </div>
                      </div>

                      {/* Optimal threshold table */}
                      <div style={{background:AP.tag,border:`1px solid ${AP.tagBorder}`,borderRadius:14,padding:"20px 22px"}}>
                        <div style={{fontSize:11,fontWeight:600,color:AP.muted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:14}}>
                          No SMOTE vs SMOTE vs Optimal Threshold
                        </div>
                        {(() => {
                          const lrBestIdx = lrSweep.indexOf(lrSweep.reduce((b,m)=>m.f1>b.f1?m:b, lrSweep[0]||{f1:0}));
                          const dtBestIdx = dtSweep.indexOf(dtSweep.reduce((b,m)=>m.f1>b.f1?m:b, dtSweep[0]||{f1:0}));
                          const lrOptT = sweepThresholds[lrBestIdx];
                          const dtOptT = sweepThresholds[dtBestIdx];
                          const lrOpt = lrSweep[lrBestIdx] || lrM50;
                          const dtOpt = dtSweep[dtBestIdx] || dtM50;
                          // No-SMOTE rows: hardcoded from Python analysis script output (backend only holds SMOTE-trained scores)
                          const lrNoSmote   = {precision:0.3333, recall:0.1000, f1:0.1538, tp:1, fn:9};
                          const lrNoSmote81 = {precision:1.0000, recall:0.1000, f1:0.1818, tp:1, fn:9};
                          const dtNoSmote20 = {precision:0.3333, recall:0.6000, f1:0.4286, tp:6, fn:4};
                          const dtNoSmote50 = {precision:0.4444, recall:0.4000, f1:0.4211, tp:4, fn:6};
                          const tableRows = [
                            {model:"LR — No SMOTE (t=0.50)",               m:lrNoSmote,   accent:THEMES.logistic_regression.accent, hi:false, tag:null},
                            {model:"LR — No SMOTE (t=0.81)",               m:lrNoSmote81, accent:THEMES.logistic_regression.accent, hi:false, tag:null},
                            {model:"LR — SMOTE, Default (t=0.50)",          m:lrM50,       accent:THEMES.logistic_regression.accent, hi:false, tag:null},
                            {model:`LR — SMOTE + Optimal (t=${lrOptT?.toFixed(2)})`, m:lrOpt, accent:THEMES.logistic_regression.accent, hi:true, tag:"best recall"},
                            {model:"DT — No SMOTE (t=0.20)",               m:dtNoSmote20, accent:THEMES.decision_tree.accent,       hi:true,  tag:"best F1 score"},
                            {model:"DT — No SMOTE (t=0.50)",               m:dtNoSmote50, accent:THEMES.decision_tree.accent,       hi:false, tag:null},
                            {model:"DT — SMOTE, Default (t=0.50)",          m:dtM50,       accent:THEMES.decision_tree.accent,       hi:false, tag:null},
                            {model:`DT — SMOTE + Optimal (t=${dtOptT?.toFixed(2)})`, m:dtOpt, accent:THEMES.decision_tree.accent, hi:false, tag:null},
                          ];
                          return (
                            <div className="table-scroll"><div style={{minWidth:500}}>
                              <div style={{display:"grid",gridTemplateColumns:"2.4fr 1fr 1fr 1fr 1fr",padding:"7px 12px",
                                background:AP.surfaceHi,borderRadius:"8px 8px 0 0",border:`1px solid ${AP.border}`}}>
                                {["Model / Configuration","Precision","Recall","F1-Score","Fraud Caught"].map(h=>(
                                  <span key={h} style={{fontSize:10,fontWeight:600,color:AP.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>{h}</span>
                                ))}
                              </div>
                              {tableRows.map(({model,m,accent,hi,tag},i)=>(
                                <div key={i} style={{display:"grid",gridTemplateColumns:"2.4fr 1fr 1fr 1fr 1fr",
                                  padding:"10px 12px",background:hi?`${accent}11`:i%2===0?AP.surface:AP.tag,
                                  border:`1px solid ${hi?accent+"44":AP.border}`,borderTop:"none",
                                  borderRadius:i===tableRows.length-1?"0 0 8px 8px":"none",alignItems:"center"}}>
                                  <span style={{fontSize:12,fontWeight:hi?700:400,color:hi?accent:AP.text,display:"flex",alignItems:"center",gap:6}}>
                                    {model}
                                    {tag && <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${accent}22`,color:accent,letterSpacing:"0.05em",textTransform:"uppercase"}}>{tag}</span>}
                                  </span>
                                  <span style={{fontSize:12,fontWeight:hi?700:400,color:hi?accent:AP.text}}>{(m.precision*100).toFixed(1)}%</span>
                                  <span style={{fontSize:12,fontWeight:hi?700:400,color:hi?accent:AP.text}}>{(m.recall*100).toFixed(1)}%</span>
                                  <span style={{fontSize:12,fontWeight:hi?700:400,color:hi?accent:AP.text}}>{(m.f1*100).toFixed(1)}%</span>
                                  <span style={{fontSize:12,fontWeight:hi?700:400,color:hi?accent:AP.text}}>{m.tp} / {m.tp+m.fn}</span>
                                </div>
                              ))}
                            </div></div>
                          );
                        })()}
                      </div>

                      {/* Interpretation */}
                      {(() => {
                        const lrBestIdx = lrSweep.indexOf(lrSweep.reduce((b,m)=>m.f1>b.f1?m:b, lrSweep[0]||{f1:0}));
                        const dtBestIdx = dtSweep.indexOf(dtSweep.reduce((b,m)=>m.f1>b.f1?m:b, dtSweep[0]||{f1:0}));
                        const lrOptT = sweepThresholds[lrBestIdx];
                        const dtOptT = sweepThresholds[dtBestIdx];
                        const lrOpt  = lrSweep[lrBestIdx] || {};
                        const dtOpt  = dtSweep[dtBestIdx] || {};
                        const lrBase = hasData ? computeMetrics(ts?.lr_scores||analysisResults.lrScores, ts?.lr_labels||analysisResults.labels, 0.5) : {};
                        const dtBase = hasData ? computeMetrics(ts?.dt_scores||analysisResults.dtScores, ts?.dt_labels||analysisResults.labels, 0.5) : {};
                        const lrRecallGain = lrOpt.recall !== undefined ? ((lrOpt.recall - 0.10)*100).toFixed(1) : null;
                        const dtF1Shift    = dtOpt.f1 !== undefined && dtBase.f1 !== undefined ? ((dtOpt.f1 - dtBase.f1)*100).toFixed(1) : null;
                        const lrNoSmote  = {precision:0.3333, recall:0.1000, f1:0.1538, tp:1, fn:9};
                        const dtNoSmote  = {precision:0.3333, recall:0.6000, f1:0.4286, tp:6, fn:4};
                        return (
                          <div style={{background:AP.surface,border:`1px solid ${AP.border}`,borderRadius:14,padding:"20px 22px"}}>
                            <div style={{fontSize:13,fontWeight:600,color:AP.text,marginBottom:10}}>Interpretation</div>
                            <div style={{fontSize:13,color:AP.muted,lineHeight:1.8}}>
                              <strong style={{color:THEMES.decision_tree.accent}}>DT without SMOTE at t=0.20 is the strongest single configuration</strong>
                              {" "}(F1={((dtNoSmote?.f1||0.4286)*100).toFixed(1)}%, Precision={((dtNoSmote?.precision||0.3333)*100).toFixed(1)}%, {dtNoSmote?.tp||6}/10 caught).
                              Lowering the threshold to 0.20 allows the DT to catch 6 of 10 fraud cases without requiring any oversampling.
                              SMOTE actively hurts the DT — applying it at the default threshold drops recall from 60% to{" "}
                              <strong style={{color:AP.text}}>{(dtBase?.recall*100||0).toFixed(0)}%</strong> and F1 from 42.9% to{" "}
                              <strong style={{color:AP.text}}>{(dtBase?.f1*100||0).toFixed(1)}%</strong>.
                              Even the DT's SMOTE + optimal threshold{" "}
                              (t={dtOptT?.toFixed(2)}, F1={((dtOpt?.f1||0)*100).toFixed(1)}%) cannot recover to the no-SMOTE baseline.
                              {" "}<strong style={{color:THEMES.logistic_regression.accent}}>LR tells the opposite story.</strong>{" "}
                              Without SMOTE, LR catches only 1-in-10 frauds regardless of threshold — raising the threshold to 0.81 improves precision to 100% but still only catches 1 fraud.
                              SMOTE alone at t=0.50 doesn't help much either (Recall={((lrBase?.recall||0)*100).toFixed(0)}%).
                              Only combining SMOTE with threshold tuning at{" "}
                              <strong style={{color:THEMES.logistic_regression.accent}}>t={lrOptT?.toFixed(2)}</strong>{" "}
                              unlocks LR's potential: {lrOpt?.tp||7}/10 caught, Recall={((lrOpt?.recall||0)*100).toFixed(0)}%
                              {lrRecallGain && <> (+<strong style={{color:THEMES.logistic_regression.accent}}>{lrRecallGain}pp</strong> vs no SMOTE)</>}.
                              {" "}<strong style={{color:AP.text}}>The tradeoff is clear:</strong>{" "}
                              DT no SMOTE (t=0.20) offers the best balance of recall and F1 with minimal false alarms;
                              LR requires SMOTE + threshold tuning to be competitive, at the cost of more false positives.
                              SMOTE is not universally beneficial — it must be validated per model.
                            </div>
                          </div>
                        );
                      })()}
                    </>);
                  })()}
                </div>
              )}

              {/* ══════ Summary ══════ */}
              {rqTab === "summary" && (
                <div style={{display:"grid",gap:16,animation:"fadeUp 0.25s ease"}}>
                  {sectionHead("Study Summary", "Key findings across all three research questions")}
                  {[
                    {
                      title: "Model Comparison",
                      accent: AP.accent,
                      body: <>
                        This study evaluated two machine learning models, Decision Tree and Logistic Regression, for detecting credit card fraud in a highly imbalanced dataset of 5,000 synthetic transactions (1.04% fraud rate).
                        The <strong style={{color:THEMES.decision_tree.accent}}>Decision Tree without SMOTE at a threshold of 0.20</strong> produced the best overall configuration,
                        achieving the highest F1 score while keeping false positives low — demonstrating that the DT is sufficiently sensitive to fraud patterns without requiring oversampling.
                        Logistic Regression with SMOTE and threshold tuning caught more fraud cases in absolute terms but at the cost of significantly more false alarms.
                        {" "}<strong style={{color:AP.text}}>The recommended model is Decision Tree with no SMOTE and a classification threshold of 0.20.</strong>
                      </>
                    },
                    {
                      title: "Behavioral Feature Engineering",
                      accent: AP.safe,
                      body: <>
                        Behavioral feature engineering added measurable value.
                        The <strong style={{color:AP.text}}>is_high_amt</strong> and <strong style={{color:AP.text}}>amt_per_month</strong> features showed 8–10× fraud-rate uplifts and ranked among the top LR coefficients.
                        Adding the full behavioral feature set raised LR's ROC-AUC from 0.332 to 0.933.
                        {" "}SMOTE was necessary for LR threshold tuning to work but hurt the Decision Tree outright — a reminder that{" "}
                        <strong style={{color:AP.text}}>oversampling is not universally beneficial and needs to be validated per model.</strong>
                      </>
                    },
                    {
                      title: "Limitations & Future Work",
                      accent: AP.amber,
                      body: <>
                        Given the modest absolute F1 scores and the limited number of fraud cases (52 total, 10 in the test set), these results should be interpreted cautiously.
                        Future work should incorporate richer behavioral signals such as{" "}
                        <strong style={{color:AP.text}}>transaction velocity and geographic patterns</strong>{" "}
                        and be validated on larger, real-world datasets to better assess how well these findings hold up outside a synthetic environment.
                      </>
                    },
                  ].map(({title, accent, body}) => (
                    <div key={title} style={{background:AP.tag,border:`1px solid ${accent}33`,borderRadius:14,padding:"22px 24px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:accent,flexShrink:0}}/>
                        <span style={{fontSize:14,fontWeight:700,color:accent}}>{title}</span>
                      </div>
                      <div style={{fontSize:13,color:AP.muted,lineHeight:1.8}}>{body}</div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })()}

      </div> {/* end minHeight wrapper */}
    </>
  );
}
