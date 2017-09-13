'use strict';

window.pin = (function () {
  var tokyoPinMap = window.map.tokyoPinMap;

  var pin = {
    toggleActivePin: toggleActivePin,
    createPins: createPins
  };

  function toggleActivePin(event) {
    var targetElement = event.target;

    while (targetElement !== tokyoPinMap) {
      if (targetElement.classList.contains('pin')) {
        var pins = tokyoPinMap.querySelectorAll('.pin:not(.pin__main)');

        pins.forEach(function (pinItem, index) {
          pinItem.classList.remove('pin--active');

          if (pinItem === targetElement) {
            targetElement.classList.add('pin--active');
            window.card.renderOfferDialog(window.card.dialog, window.data.ads[index]);
            window.card.openDialog();
          }
        });
        return;
      }
      targetElement = targetElement.parentNode;
    }
  }

  function createPinElement(ad) {
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

  function createPins(adsArray) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < adsArray.length; i++) {
      pinsFragment.appendChild(createPinElement(adsArray[i]));
    }

    return pinsFragment;
  }

  tokyoPinMap.addEventListener('click', function (event) {
    pin.toggleActivePin(event);
  });
  tokyoPinMap.addEventListener('keydown', function (event) {
    window.util.isEnterEvent(event, toggleActivePin.bind(event));
  });

  return pin;
})();
