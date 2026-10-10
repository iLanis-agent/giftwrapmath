const M = require("./engine.js");
const cases = require("./expected.json");
let checks = 0, failures = 0;
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
const renderFn = { paperSize: "renderPaper", ribbonLength: "renderRibbon", rollCoverage: "renderRoll" };
for (const c of cases) {
  const res = M[c.fn](...c.args);
  checks++;
  if (!eq(res, c.result)) { failures++; console.log("RESULT MISMATCH", c.fn, c.args, "\n got:", JSON.stringify(res), "\n exp:", JSON.stringify(c.result)); }
  const text = M[renderFn[c.fn]](res);
  checks++;
  if (text !== c.render) { failures++; console.log("RENDER MISMATCH", c.fn, c.args, "\n got:", text, "\n exp:", c.render); }
  checks++;
  if (res.error) { if (text !== res.error) { failures++; console.log("ERROR RENDER", c.fn, c.args); } }
  else if (!/[0-9]/.test(text)) { failures++; console.log("EMPTY RENDER", c.fn, c.args); }
}
console.log(`${checks} checks, ${failures} failures over ${cases.length} cases`);
process.exit(failures ? 1 : 0);
