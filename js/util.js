'use strict';

window.util = (function () {
  var KEYCODES = {
    enter: 13,
    esc: 27
  };

  var util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    errorHandler: errorHandler
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

  function errorHandler(errorMessage) {
    var divElement = document.createElement('div');
    divElement.style.cssText = 'position: fixed; z-index: 100; left: 0; top: 0; right: 0; padding: 0.5rem; text-align: center; font-size: 1.5rem; background-color: #f57170;';
    divElement.textContent = errorMessage;
    document.body.appendChild(divElement);
  }

  return util;
})();
