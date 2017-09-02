'use strict';

window.pin = (function () {
  var dialog = document.querySelector('#offer-dialog');
  var tokioPinMap = document.querySelector('.tokyo__pin-map');

  var toggleActivePin = function (event) {
    var targetElement = event.target;

    while (targetElement !== tokioPinMap) {
      if (targetElement.classList.contains('pin')) {
        var pins = tokioPinMap.querySelectorAll('.pin:not(.pin__main)');

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
  };
  var generatePinElement = function (ad) {
    var pinElement = document.createElement('div');
    var pinImageElement = '<img src="' + ad.author.avatar + '" class="rounded" width="40" height="40">';
    var PIN_WIDTH = 56;
    var PIN_HEIGHT = 75;

    pinElement.className = 'pin';
    pinElement.tabIndex = 0;
    pinElement.setAttribute('style', 'left: ' + (ad.location.x - PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - PIN_HEIGHT) + 'px;');
    pinElement.insertAdjacentHTML('beforeend', pinImageElement);

    return pinElement;
  };
  var generatePins = function (adsArray) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < adsArray.length; i++) {
      pinsFragment.appendChild(generatePinElement(adsArray[i]));
    }

    return pinsFragment;
  };

  tokioPinMap.appendChild(generatePins(window.data.ads));
  tokioPinMap.addEventListener('click', function (event) {
    toggleActivePin(event);
  });
  tokioPinMap.addEventListener('keydown', function (event) {
    window.util.isEnterEvent(event, toggleActivePin.bind(event));
  });
})();
