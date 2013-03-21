var views = views || {};

views.tools = new jaspi.views.View({
    
    tools: {},
    toolBlock: null,
    
    init: function () {
        var self = this;
        self.toolBlock = $('.toolBlock');
        views.tabs.on('clickTab', function (name) {
            self.activate(name);
        });
        views.tabs.on('closeTab', function (name) {
            self.remove(name);
        });
    },
    
    add: function (tool) {
        var self = this;
        if (typeof tool.template === 'string') {
            tool.template = Handlebars.compile(tool.template.trim());
        }
        tool.elem = $('<div>' + tool.template(tool.context || {}) + '</div>');
        tool.start.call(tool);
        tool.elem.hide();
        self.toolBlock.append(tool.elem);
        self.tools[tool.name] = tool;
        // Tab
        views.tabs.addTab(tool.name, tool.title, tool.app);
    },
    
    activate: function (name) {
        var self = this,
            tool = self.tools[name];
        if (self.currentTool) {
            self.currentTool.elem.hide();
        }
        self.currentTool = tool;
        self.currentTool.elem.show();
        self.currentTool.activate.call(self.currentTool);
    },
    
    remove: function (name) {
        var self = this,
            tool = self.tools[name];
        tool.close.call(tool);
        tool.elem.hide();
        delete self.tools[name];
    },
    
});