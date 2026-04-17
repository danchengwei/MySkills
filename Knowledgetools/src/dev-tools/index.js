class DevTools {
  constructor() {
    this.tools = [];
  }

  addTool(tool) {
    this.tools.push(tool);
    return this;
  }

  listTools() {
    console.log('可用开发工具:');
    return this.tools;
  }
}

module.exports = DevTools;
