// Giftwrap math engine - pure arithmetic, shared by the page and the tests.
// Every borrowed number is a labeled norm, not a rule.
(function (root) {
"use strict";

// Labeled norms:
// - Paper: 5 cm overlap where the wrap meets, 5 cm total end allowance (the ends fold up about half the box height).
//   Paper width wraps the box girth: 2 x (width + height) + overlap. Paper length: length + height + end allowance.
// - Ribbon: twice around length + width, four times the height, plus a labeled 60 cm bow allowance.
var OVERLAP = 5;
var END_ALLOW = 5;
var BOW = 60;

function r1(x) { return Math.round(x * 10) / 10; }
function r2(x) { return Math.round(x * 100) / 100; }
function positive() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (typeof v !== "number" || !isFinite(v) || v <= 0) return false;
  }
  return true;
}

function paperSize(l, w, h) {
  if (!positive(l, w, h)) return { error: "box dimensions must be positive" };
  return {
    paperW: r1(2 * (w + h) + OVERLAP),
    paperL: r1(l + h + END_ALLOW),
    l: r1(l), w: r1(w), h: r1(h)
  };
}

function renderPaper(r) {
  if (r.error) return r.error;
  return r.paperW + " x " + r.paperL + " cm of paper for a " + r.l + " x " + r.w + " x " + r.h +
    " cm box - labeled " + OVERLAP + " cm overlap and " + END_ALLOW + " cm end allowance.";
}

function ribbonLength(l, w, h) {
  if (!positive(l, w, h)) return { error: "box dimensions must be positive" };
  var cm = r1(2 * (l + w) + 4 * h + BOW);
  return { cm: cm, m: r2(cm / 100), l: r1(l), w: r1(w), h: r1(h) };
}

function renderRibbon(r) {
  if (r.error) return r.error;
  return r.cm + " cm of ribbon (about " + r.m + " m) for a " + r.l + " x " + r.w + " x " + r.h +
    " cm box - labeled " + BOW + " cm bow allowance.";
}

function rollCoverage(rollW, rollL, l, w, h) {
  if (!positive(rollW, rollL)) return { error: "roll dimensions must be positive" };
  var p = paperSize(l, w, h);
  if (p.error) return { error: "box dimensions must be positive" };
  var acrossA = Math.floor(rollW / p.paperW), alongA = Math.floor(rollL / p.paperL);
  var a = acrossA * alongA;
  var acrossB = Math.floor(rollW / p.paperL), alongB = Math.floor(rollL / p.paperW);
  var b = acrossB * alongB;
  if (a === 0 && b === 0) return { error: "roll is too small for one wrap" };
  var useB = b > a;
  return {
    paperW: p.paperW, paperL: p.paperL,
    boxes: useB ? b : a,
    across: useB ? acrossB : acrossA,
    along: useB ? alongB : alongA,
    rotated: useB
  };
}

function renderRoll(r) {
  if (r.error) return r.error;
  return r.boxes + " box" + (r.boxes === 1 ? "" : "es") + " per roll - " + r.paperW + " x " + r.paperL +
    " cm pieces, " + r.across + " across x " + r.along + " along" + (r.rotated ? " (rotated fits better)" : "") + ".";
}

var api = {
  paperSize: paperSize,
  ribbonLength: ribbonLength,
  rollCoverage: rollCoverage,
  renderPaper: renderPaper,
  renderRibbon: renderRibbon,
  renderRoll: renderRoll
};
if (typeof module !== "undefined" && module.exports) module.exports = api;
root.GiftwrapMath = api;
})(typeof window !== "undefined" ? window : globalThis);
