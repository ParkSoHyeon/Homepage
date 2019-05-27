var utility = {
    uiEnhancements: function (element) {
        var $element = $(this.element || element || document),
            uiObject = this.ui || this;

        // dom 갱신되는 경우에 다시 dom을 탐색하기 위해서 string객체저장
        if (!uiObject.__uiString) {
            uiObject.__uiString = $.extend(true, {}, uiObject);
        }

        if (this.ui) {
            this.element = $element;
        }
        for (var key in uiObject.__uiString) {
            if (key !== "__uiString") {
                uiObject[key] = (typeof uiObject.__uiString[key] === "function") ? uiObject.__uiString[key]()
                    : $element.find(uiObject.__uiString[key]);
            }
        }

        return {
            element: $element,
            ui: uiObject,
            getSelector: function(key){uiObject.__uiString[key]}
        }
    }
}
