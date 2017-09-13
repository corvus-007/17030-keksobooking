'use strict';

window.map = (function () {
  var MAIN_PIN_WIDTH = 75;
  var MAIN_PIN_HEIGHT = 94;
  var tokyo = document.querySelector('.tokyo');
  var tokyoPinMap = document.querySelector('.tokyo__pin-map');
  var mainPin = document.querySelector('.pin__main');
  var tokyoBounds = tokyo.getBoundingClientRect();
  var startCoords = {};
  var mainPinOffsetLeft = null;
  var mainPinOffsetTop = null;

  var map = {
    getMainPinCoords: getMainPinCoords
  };

  function selectFirstPin() {
    var firstPinEvent = {
      target: tokyoPinMap.querySelector('.pin:not(.pin__main)')
    };

    window.pin.toggleActivePin(firstPinEvent);
  }

  function updateTokyoBounds() {
    tokyoBounds = tokyo.getBoundingClientRect();
  }

  function getStartX(mouseX) {
    var startX = null;

    if (mouseX <= tokyoBounds.left) {
      startX = tokyoBounds.left;
    } else if (mouseX >= tokyoBounds.right) {
      startX = tokyoBounds.right;
    } else {
      startX = mouseX;
    }

    return startX;
  }

  function getStartY(mouseY) {
    var startY = null;

    if (mouseY <= tokyoBounds.top) {
      startY = tokyoBounds.top;
    } else if (mouseY >= tokyoBounds.bottom) {
      startY = tokyoBounds.bottom;
    } else {
      startY = mouseY;
    }

    return startY;
  }

  function onMouseMove(event) {
    var shift = {
      x: startCoords.x - event.clientX,
      y: startCoords.y - event.clientY
    };

    startCoords.x = getStartX(event.clientX, tokyoBounds);
    startCoords.y = getStartY(event.clientY, tokyoBounds);

    if (((mainPin.offsetLeft - shift.x) + (MAIN_PIN_WIDTH / 2)) <= 0) {
      mainPinOffsetLeft = -(MAIN_PIN_WIDTH / 2);
    } else if (((mainPin.offsetLeft - shift.x) + MAIN_PIN_WIDTH / 2) >= tokyoBounds.width) {
      mainPinOffsetLeft = (tokyoBounds.width - MAIN_PIN_WIDTH / 2);
    } else {
      mainPinOffsetLeft = (mainPin.offsetLeft - shift.x);
    }

    if ((mainPin.offsetTop - shift.y) <= 0) {
      mainPinOffsetTop = 0;
    } else if ((mainPin.offsetTop - shift.y + MAIN_PIN_HEIGHT) >= tokyoBounds.height) {
      mainPinOffsetTop = (tokyoBounds.height - MAIN_PIN_HEIGHT);
    } else {
      mainPinOffsetTop = (mainPin.offsetTop - shift.y);
    }

    mainPin.style.left = mainPinOffsetLeft + 'px';
    mainPin.style.top = mainPinOffsetTop + 'px';

    window.form.setNoticeAddress();
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function getMainPinCoords() {
    return {
      x: mainPin.offsetLeft + MAIN_PIN_WIDTH / 2,
      y: mainPin.offsetTop + MAIN_PIN_HEIGHT
    };
  }

  window.addEventListener('scroll', function () {
    updateTokyoBounds();
  });

  mainPin.addEventListener('mousedown', function (event) {
    event.preventDefault();

    startCoords = {
      x: event.clientX,
      t: event.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.card.closeDialog();
  });

  window.backend.load(function (response) {
    window.data.ads = response;
    tokyoPinMap.insertBefore(window.pin.createPins(window.data.ads), mainPin);
    selectFirstPin();
  }, window.util.errorHandler);

  return map;
})();
