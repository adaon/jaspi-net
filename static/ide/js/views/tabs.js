/*
* Events:
* 
* clickTab(name)
* closeTab(name)
*/

var views = views || {};

views.tabs = new jaspi.views.View({
    
    init: function () {
        var self = this;
        self.tabPanel = $('.tabPanelBlock');
    },
    
    templates: {
        tab: '#tabTemplate'
    },
    
    addTab: function (name, title, app) {
        var self = this,
            context = {
                name: name,
                title: title,
                app: app
            },
            elem = $(self.templates.tab({tab: context}));
        // Render
        self.tabPanel.append(elem);
        // Events
        elem.mousedown(function (event) {
            if (event.which === 1) {
                self.selectTab(this.dataset.name);
                return;
            }
        });
        elem.mouseup(function (event) {
            if (event.which === 2) {
                self.removeTab(this.dataset.name);
            }
        });
        elem.find('img').mousedown(function (event) {
            if (event.which === 1) {
                event.stopPropagation();
                event.preventDefault();
                self.removeTab(name);
            }
        });
    },
    
    selectTab: function (name) {
        var self = this;
        $('.tabBlock').removeClass('selected');
        $('.tabBlock[data-name="' + name + '"]').addClass('selected');
        self.emit('clickTab', name);
    },
    
    clearTabs: function () {
        var self = this;
        self.tabPanel.empty();
    },
    
    setTabs: function (tabs) {
        var self = this;
        self.clearTabs();
        _.each(tabs, function (tab, name) {
            if (!tab.name) {
                tab.name = name;
            }
            self.addTab(tab.name, tab.title, tab.app);
        });
    },
    
    removeTab: function (name) {
        var self = this;
        self.tabPanel.find('.tabBlock[data-name="' + name + '"]')
            .each(function () {
                var elem = $(this);
                elem.html('').animate({
                    width: 0
                }, {
                    duration: 250, 
                    complete: function () {
                        elem.remove();
                    }
                });
                self.emit('closeTab', this.dataset.name);
            });
    },
});