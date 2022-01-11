import originalAssert from "assert"
import fs from "fs";

const EPSILON = 1e-5;
const assert = {
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(Math.abs(expected - actual) < EPSILON, msg),
  tupleEqual : (actual, expected, msg) => {
    assert.epsilonEqual(actual.x, expected.x, "x");
    assert.epsilonEqual(actual.y, expected.y, "y");
    assert.epsilonEqual(actual.z, expected.z, "z");
    assert.epsilonEqual(actual.w, expected.w, "w");
  },
  ...originalAssert
}
let ALL_TESTS = [];
export function test(msg, code){
  ALL_TESTS.push({msg, code});
}

function runAllTests(tests){
  console.log("1.." + tests.length);
  tests.forEach(({ code, msg }, index) => {
    try {
      code(assert);
      console.log(`ok ✅ ${index + 1 } - ${msg}`);
    } catch (error) {
      console.log(`not ok ❌ ${index + 1 } - ${msg} : ${error}`);
    }
  });
}
global.test = test;
let files = fs.readdirSync("./tests").filter(fileName => fileName.endsWith(".test.js"));
for(let file of files){
  console.log("importing file :", file);
  await import("./" + file);
}

runAllTests(ALL_TESTS);
