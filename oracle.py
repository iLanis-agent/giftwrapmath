#!/usr/bin/env python3
"""Independent oracle for Giftwrap math. Mirrors engine.js float ops exactly."""
import json, math

OVERLAP = 5
END_ALLOW = 5
BOW = 60

def r1(x): return math.floor(x * 10 + 0.5) / 10
def r2(x): return math.floor(x * 100 + 0.5) / 100

def num(x):
    if x == int(x) and abs(x) < 1e15:
        return str(int(x))
    return repr(x)

def paper_size(l, w, h):
    if not all(isinstance(v, (int, float)) and math.isfinite(v) and v > 0 for v in (l, w, h)):
        return {"error": "box dimensions must be positive"}
    return {"paperW": r1(2 * (w + h) + OVERLAP), "paperL": r1(l + h + END_ALLOW),
            "l": r1(l), "w": r1(w), "h": r1(h)}

def render_paper(r):
    if "error" in r: return r["error"]
    return (f"{num(r['paperW'])} x {num(r['paperL'])} cm of paper for a {num(r['l'])} x {num(r['w'])} x "
            f"{num(r['h'])} cm box - labeled {OVERLAP} cm overlap and {END_ALLOW} cm end allowance.")

def ribbon_length(l, w, h):
    if not all(isinstance(v, (int, float)) and math.isfinite(v) and v > 0 for v in (l, w, h)):
        return {"error": "box dimensions must be positive"}
    cm = r1(2 * (l + w) + 4 * h + BOW)
    return {"cm": cm, "m": r2(cm / 100), "l": r1(l), "w": r1(w), "h": r1(h)}

def render_ribbon(r):
    if "error" in r: return r["error"]
    return (f"{num(r['cm'])} cm of ribbon (about {num(r['m'])} m) for a {num(r['l'])} x {num(r['w'])} x "
            f"{num(r['h'])} cm box - labeled {BOW} cm bow allowance.")

def roll_coverage(roll_w, roll_l, l, w, h):
    if not all(isinstance(v, (int, float)) and math.isfinite(v) and v > 0 for v in (roll_w, roll_l)):
        return {"error": "roll dimensions must be positive"}
    p = paper_size(l, w, h)
    if "error" in p:
        return {"error": "box dimensions must be positive"}
    across_a = math.floor(roll_w / p["paperW"]); along_a = math.floor(roll_l / p["paperL"])
    a = across_a * along_a
    across_b = math.floor(roll_w / p["paperL"]); along_b = math.floor(roll_l / p["paperW"])
    b = across_b * along_b
    if a == 0 and b == 0:
        return {"error": "roll is too small for one wrap"}
    use_b = b > a
    return {"paperW": p["paperW"], "paperL": p["paperL"], "boxes": b if use_b else a,
            "across": across_b if use_b else across_a, "along": along_b if use_b else along_a,
            "rotated": use_b}

def render_roll(r):
    if "error" in r: return r["error"]
    s = "es" if r["boxes"] != 1 else ""
    rot = " (rotated fits better)" if r["rotated"] else ""
    return (f"{r['boxes']} box{s} per roll - {num(r['paperW'])} x {num(r['paperL'])} cm pieces, "
            f"{r['across']} across x {r['along']} along{rot}.")

cases = []
for l, w, h in [(33, 20, 12), (10, 10, 10), (25, 18, 8), (40, 30, 15), (12.5, 9, 4.5),
                (50, 40, 20), (8, 8, 3), (0, 20, 12), (33, -5, 12), (20, 15, 0)]:
    res = paper_size(l, w, h)
    cases.append({"fn": "paperSize", "args": [l, w, h], "result": res, "render": render_paper(res)})
for l, w, h in [(33, 20, 12), (15, 10, 5), (25, 18, 8), (40, 30, 15), (12.5, 9, 4.5),
                (60, 45, 25), (7, 7, 2), (-1, 10, 5), (10, 0, 5)]:
    res = ribbon_length(l, w, h)
    cases.append({"fn": "ribbonLength", "args": [l, w, h], "result": res, "render": render_ribbon(res)})
for rw, rl, l, w, h in [(70, 300, 33, 20, 12), (50, 200, 33, 20, 12), (40, 100, 33, 20, 12),
                        (70, 300, 10, 10, 10), (100, 500, 25, 18, 8), (76, 250, 20, 15, 10),
                        (30, 90, 12, 9, 6), (0, 300, 33, 20, 12), (70, -5, 33, 20, 12),
                        (70, 300, 0, 20, 12), (60, 180, 30, 22, 14), (52, 150, 15, 12, 8)]:
    res = roll_coverage(rw, rl, l, w, h)
    cases.append({"fn": "rollCoverage", "args": [rw, rl, l, w, h], "result": res, "render": render_roll(res)})

with open("expected.json", "w") as f:
    json.dump(cases, f, separators=(",", ":"))
    f.write("\n")
print(len(cases), "cases written")
