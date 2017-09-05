'use strict';

window.util = (function () {
  var KEYCODES = {
    enter: 13,
    esc: 27
  };

  var util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent
  };

  function isEscEvent(event, action) {
    if (event.keyCode === KEYCODES.esc) {
      action();
    }
  }
  function isEnterEvent(event, action) {
    if (event.keyCode === KEYCODES.enter) {
      action(event);
    }
  }

  return util;
})();
