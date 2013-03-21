/*
* Events:
* 
* clickProjectTool(name)
* clickTool(name)
* clickApp(name)
*/

var views = views || {};

views.cp = new jaspi.views.View({
    
    tools: {},
    hiddenTools: [],
    
    init: function () {
        var self = this;
        self.panel = $('.controlPanelBlock');
        self.toolsPanel = $('.toolsPanel');
        self.projectToolsButton = $('.projectToolsButton');
        self.currentAppButton = $('.currentAppButton');
        self.allToolsButton = $('.allToolsButton');
        self.setEvents();
    },
    
    setEvents: function () {
        var self = this;
        self.allToolsButton.click(function () {
            if (self.allToolsList) {
                self.hideAllTools();
            } else {
                self.showAllTools();
            }
        });
        $(window).resize(function () {
            self.normalizeToolButtons();
        });
    },
    
    templates: {
        toolButton: '#toolButtonTemplate',
        list: '#controlListTemplate'
    },
    
    addToolButton: function (name, title) {
        var self = this,
        // Context
            context = {
                name: name.name || name,
                title: title || name.title
            },
        // Element
            elem = $(self.templates.toolButton(context));
        // Render
        self.toolsPanel.append(elem);
        // Events
        elem.click(function () {
            self.emit('clickTool', this.dataset.name);
        });
        // State
        self.tools[context.name] = context.title;
        
        self.normalizeToolButtons();
    },
    
    removeToolButton: function (name) {
        var self = this;
        // Render
        self.toolsPanel.find('.toolButton[data-name="' + name + '"]').
            remove();
        // State
        delete self.tools[name];
        self.normalizeToolButtons();
    },
    
    clearToolButtons: function () {
        var self = this;
        // Render
        self.toolsPanel.find('.toolButton').remove();
        // State
        self.tools = {};
        self.normalizeToolButtons();
    },
    
    setToolButtons: function (tools) {
        var self = this;
        _.each(tools, function (title, name) {
            self.addToolButton(name, title);
        });
        // State
        self.tools = tools;
        self.normalizeToolButtons();
    },
    
    /*
    * Если сумма ширин кнопок инструментов превышает ширину панели инструментов,
    * кнопка последнего добавленного инструмента скрывается, появляется кнопка
    * показа всех инструментов, после чего опять вызывается 
    */
    normalizeToolButtons: function () {
        var self = this,
            max = $(window).width() - 150,
            toolsWidth = 0;
        self.toolsPanel.find('.toolButton.visible').each(function () {
            if ($(this).css('display') !== 'hidden') {
                toolsWidth += $(this).width() + 10;
            }            
        });
        if (toolsWidth > max) {
            self.hiddenTools.push($('.toolButton.visible:first'));
            $('.toolButton.visible:first').hide().removeClass('visible');
            $('.allToolsButton').show();
            self.allToolsButton.show();
        }
    },
    
    createControlList: function (items) {
        var self = this,
            list = [];
        _.each(items, function (title, name) {
            list.push({name: name, title: title});
        });
        return $(self.templates.list({list: list}));
    },
    
    showProjectTools: function (tools) {
        var self = this,
            elem = self.createControlList(tools);
        // Appearance
        self.projectToolsButton.addClass('selected');
        self.projectToolsButton.find('img')
            .attr('src', '/ide/images/projecttools2.png');
        elem.css({
            'top': '30px',
            'left': '0px'
        });
        // Render
        $('body').append(elem);
        // State
        self.projectToolsList = elem;
        // Events
        elem.find('.controlListItemBlock').click(function () {
            self.emit('clickProjectTool', this.dataset.name);
        });
    },
    
    hideProjectTools: function () {
        var self = this;
        // Appearance
        self.projectToolsButton.removeClass('selected');
        self.projectToolsButton.find('img')
            .attr('src', '/ide/images/projecttools.png');
        // Render
        self.projectToolsList.remove();
        // State
        delete self.projectToolsList;
    },
    
    showAppsList: function (apps) {
        var self = this,
            elem = self.createControlList(apps);
        // Appearance
        self.currentAppButton.addClass('selected');
        self.currentAppButton.find('img')
            .attr('src', '/ide/images/expand2.png');
        elem.css({
            'top': '30px',
            'left': self.currentAppButton.position().left + 'px',
            'min-width': self.currentAppButton.width() + 6 > 100 ?
                self.currentAppButton.width() + 6 :
                100 + 'px'
        });
        // Render
        $('body').append(elem);
        // State
        self.appsList = elem;
        // Events
        elem.find('.controlListItemBlock').click(function () {
            self.emit('clickApp', this.dataset.name);
        });
    },
    
    hideAppsList: function () {
        var self = this;
        // Appearance
        self.currentAppButton.removeClass('selected');
        self.currentAppButton.find('img')
            .attr('src', '/ide/images/expand.png');
        // Render
        self.appsList.remove();
        // State
        delete self.appsList;
    },
    
    setCurrentApp: function (name, title) {
        var self = this;
        self.currentAppButton.find('span').html(name);
    },
    
    showAllTools: function () {
        var self = this,
            elem = self.createControlList(self.tools);
        // Appearance
        self.allToolsButton.addClass('selected');
        self.allToolsButton.find('img')
            .attr('src', '/ide/images/expand2.png');
        elem.css({
            'top': '30px',
            'right': '0px'
        });
        // Render
        $('body').append(elem);
        // State
        self.allToolsList = elem;
        // Events
        self.allToolsList.find('.controlListItemBlock').click(function () {
            self.emit('clickTool', this.dataset.name);
        });
    },
    
    hideAllTools: function () {
        var self = this;
        // Appearance
        self.allToolsButton.removeClass('selected');
        self.allToolsButton.find('img')
            .attr('src', '/ide/images/expand.png');
        // Render
        self.allToolsList.remove();
        // State
        delete self.allToolsList;
    },
});