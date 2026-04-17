class Testing {
  constructor() {
    this.tests = [];
  }

  addTest(test) {
    this.tests.push(test);
    return this;
  }

  runTests() {
    console.log('运行测试...');
    return this.tests;
  }
}

module.exports = Testing;
