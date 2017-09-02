'use strict';

window.util = (function () {
  var KEYCODES = {
    enter: 13,
    esc: 27
  };

  return {
    isEscEvent: function (event, action) {
      if (event.keyCode === KEYCODES.esc) {
        action();
      }
    },
    isEnterEvent: function (event, action) {
      if (event.keyCode === KEYCODES.enter) {
        action(event);
      }
    }
  };
})();
