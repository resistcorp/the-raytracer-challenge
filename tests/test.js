let ALL_TESTS = [];
export function test(msg, code) {
  ALL_TESTS.push({ msg, code });
}

export function runAllTests(assert, tests = ALL_TESTS) {
  //TODO: later console.log("TAP version 13");
  tests.forEach(({ code, msg }, index) => {
    try {
      code(assert);
      console.log(`ok ✅ ${index + 1} - ${msg}`);
    } catch (error) {
      console.log(`not ok ❌ ${index + 1} - ${msg} : ${error}`);
    }
  });
  console.log("1.." + tests.length);
}

export default test;