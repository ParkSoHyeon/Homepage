var Tab = function ($wrapper) {
    var controller = {
        element: $wrapper,
        ui: {
            list: '.tab-list',
            trigger: '.tab-trigger',
            target: '.tab-target'
        },
        activeClass: {
            selected: 'tab-selected'
        },
        initialize: function () {
            utility.uiEnhancements.call(this);
            this.displayTab();
            this.addEventListener();
        },
        displayTab: function () {
            var listWidth = 0;

            this.ui.trigger.each(function (index, element) {
                listWidth += $(element).outerWidth(true);
            });
            this.ui.list.width(Math.ceil(listWidth) + 6)  // 볼드 여유공간
        },
        addEventListener: function () {
            this.element.off()
                .on('click', this.ui.__uiString.trigger, $.proxy(this.tabChangeEvent, this))
        },
        tabChangeEvent: function (event) {
            event.preventDefault();
            var $trigger = $(event.currentTarget);
            var $target = $($trigger.attr('href'));

            this.displayTrigger($trigger);
            this.displayTarget($target)
        },
        displayTrigger: function ($trigger) {
            this.ui.trigger.removeClass(this.activeClass.selected);
            $trigger.addClass(this.activeClass.selected);
        },
        displayTarget: function ($target) {
            this.ui.target.removeClass(this.activeClass.selected);
            $target.addClass(this.activeClass.selected);

            var ids = [];
            $target.find('[id^="faq-"]').each(function(index, element) {
              ids.push($(element).data('id'));
            });
            $.ajax({
              url: 'https://toss.im/api/common/v1/faq?' + $.param({id: ids}, true),
              success: function(data) {
                $.each(data.faq_list, function(i, faqData) {
                  $('[id="faq-' + faqData.id + '"]').each(function(j, faqElement) {
                    $(faqElement).html(faqData.content);
                  });
                });
              }
            });
        }
    };
    controller.initialize();
};
