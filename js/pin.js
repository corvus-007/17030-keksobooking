'use strict';

window.pin = (function () {
  var MAIN_PIN_WIDTH = 75;
  var MAIN_PIN_HEIGHT = 94;
  var dialog = document.querySelector('#offer-dialog');
  var tokyo = document.querySelector('.tokyo');

  var tokyoPinMap = document.querySelector('.tokyo__pin-map');
  var mainPin = document.querySelector('.pin__main');
  var startCoords = {};
  var tokyoDimension = {
    width: tokyo.clientWidth,
    height: tokyo.clientHeight
  };
  var mainPinOffsetLeft = null;
  var mainPinOffsetTop = null;

  var pin = {
    getMainPinCoords: getMainPinCoords
  };

  function toggleActivePin(event) {
    var targetElement = event.target;

    while (targetElement !== tokyoPinMap) {
      if (targetElement.classList.contains('pin')) {
        var pins = tokyoPinMap.querySelectorAll('.pin:not(.pin__main)');

        for (var i = 0; i < pins.length; i++) {
          pins[i].classList.remove('pin--active');

          if (pins[i] === targetElement) {
            targetElement.classList.add('pin--active');
            window.card.renderOfferDialog(dialog, window.data.ads[i]);
            window.card.openDialog();
          }
        }
        return;
      }
      targetElement = targetElement.parentNode;
    }
  }

  function generatePinElement(ad) {
    var pinElement = document.createElement('div');
    var pinImageElement = '<img src="' + ad.author.avatar + '" class="rounded" width="40" height="40">';
    var PIN_WIDTH = 56;
    var PIN_HEIGHT = 75;

    pinElement.className = 'pin';
    pinElement.tabIndex = 0;
    pinElement.setAttribute('style', 'left: ' + (ad.location.x - PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - PIN_HEIGHT) + 'px;');
    pinElement.insertAdjacentHTML('beforeend', pinImageElement);

    return pinElement;
  }

  function generatePins(adsArray) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < adsArray.length; i++) {
      pinsFragment.appendChild(generatePinElement(adsArray[i]));
    }

    return pinsFragment;
  }

  function onMouseMove(event) {
    var shift = {
      x: startCoords.x - event.clientX,
      y: startCoords.y - event.clientY
    };

    startCoords.x = event.clientX;
    startCoords.y = event.clientY;

    if (((mainPin.offsetLeft - shift.x) + (MAIN_PIN_WIDTH / 2)) <= 0) {
      mainPinOffsetLeft = -(MAIN_PIN_WIDTH / 2);
    } else if (((mainPin.offsetLeft - shift.x) + MAIN_PIN_WIDTH / 2) >= tokyoDimension.width) {
      mainPinOffsetLeft = (tokyoDimension.width - MAIN_PIN_WIDTH / 2);
    } else {
      mainPinOffsetLeft = (mainPin.offsetLeft - shift.x);
    }

    if ((mainPin.offsetTop - shift.y) <= 0) {
      mainPinOffsetTop = 0;
    } else if ((mainPin.offsetTop - shift.y + MAIN_PIN_HEIGHT) >= tokyoDimension.height) {
      mainPinOffsetTop = (tokyoDimension.height - MAIN_PIN_HEIGHT);
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

  tokyoPinMap.insertBefore(generatePins(window.data.ads), mainPin);

  tokyoPinMap.addEventListener('click', function (event) {
    toggleActivePin(event);
  });
  tokyoPinMap.addEventListener('keydown', function (event) {
    window.util.isEnterEvent(event, toggleActivePin.bind(event));
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

  return pin;
})();
