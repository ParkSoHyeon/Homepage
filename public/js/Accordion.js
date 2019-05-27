var Accordion = function ($wrapper) {
    var controller = {
        element: $wrapper,
        ui: {
            trigger: '.accordion-trigger',
            target: '.accordion-target'
        },
        activeClass: {
            selected: 'accordion-selected'
        },
        initialize: function () {
            utility.uiEnhancements.call(this);
            this.addEventListener();
        },
        addEventListener: function () {
            this.element.off()
                .on('click', this.ui.__uiString.trigger, $.proxy(this.toggleEvent, this))
        },
        toggleEvent: function (event) {
            event.preventDefault();
            var $trigger = $(event.currentTarget).toggleClass(this.activeClass.selected);
            this.element.find($trigger.attr('href')).toggleClass(this.activeClass.selected);
        }
    };
    controller.initialize();
};
