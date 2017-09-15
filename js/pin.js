'use strict';

window.pin = (function () {
  var PRICE_RANGE = {
    'low': {
      'min': 0,
      'max': 10000
    },
    'middle': {
      'min': 10000,
      'max': 50000
    },
    'high': {
      'min': 50000,
      'max': Infinity
    }
  };
  var tokyoPinMap = window.map.tokyoPinMap;
  var tokyoFilters = document.querySelector('.tokyo__filters');
  var typeField = tokyoFilters.elements['housing_type'];
  var priceField = tokyoFilters.elements['housing_price'];
  var roomsField = tokyoFilters.elements['housing_room-number'];
  var guestsField = tokyoFilters.elements['housing_guests-number'];
  var featuresSet = tokyoFilters.elements['feature'];
  var filteredPins = [];

  function updatePins(adverts) {
    var oldPins = tokyoPinMap.querySelectorAll('.pin:not(.pin__main)');
    var pins = window.pin.createPins(adverts);

    Array.from(oldPins).forEach(function (pin) {
      pin.remove();
    });

    if (adverts.length === 0) {
      window.card.closeDialog();
      return;
    }

    window.map.tokyoPinMap.insertBefore(pins, window.map.mainPin);
    window.map.selectFirstPin(adverts);
    window.card.renderOfferDialog(window.card.dialog, adverts[0]);
  }

  var refreshPins = window.util.debounce(function () {
    updatePins(filteredPins);
  });

  function isTypeMatch(ad) {
    return typeField.value === 'any' ? true : ad.offer.type === typeField.value;
  }

  function isRoomsMatch(ad) {
    return roomsField.value === 'any' ? true : ad.offer.rooms === parseInt(roomsField.value, 10);
  }

  function isGuestsMatch(ad) {
    return guestsField.value === 'any' ? true : ad.offer.guests === parseInt(guestsField.value, 10);
  }

  function isPricesMatch(ad) {
    return priceField.value === 'any' ? true : (PRICE_RANGE[priceField.value].min < ad.offer.price && PRICE_RANGE[priceField.value].max > ad.offer.price);
  }

  function isFeaturesMatch(ad) {
    return Array.from(featuresSet).every(function (feature) {
      return !feature.checked || ad.offer.features.includes(feature.value);
    });
  }

  var fnFilters = [isTypeMatch, isRoomsMatch, isGuestsMatch, isPricesMatch, isFeaturesMatch];

  tokyoFilters.addEventListener('change', function () {
    filteredPins = window.data.ads.filter(function (ad) {
      return fnFilters.every(function (fn) {
        return fn(ad);
      });
    });

    refreshPins();
  });

  var pin = {
    toggleActivePin: toggleActivePin,
    createPins: createPins
  };

  function toggleActivePin(clickedPin, data) {
    if (!clickedPin) {
      window.card.closeDialog();
      return;
    }

    while (clickedPin !== tokyoPinMap) {
      if (clickedPin.classList.contains('pin')) {
        var pins = tokyoPinMap.querySelectorAll('.pin:not(.pin__main)');

        Array.from(pins).forEach(function (pinItem, index) {
          pinItem.classList.remove('pin--active');

          if (pinItem === clickedPin) {
            clickedPin.classList.add('pin--active');
            window.card.renderOfferDialog(window.card.dialog, data[index]);
            window.card.openDialog();
          }
        });
        return;
      }
      clickedPin = clickedPin.parentNode;
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
    var targetElement = event.target;
    pin.toggleActivePin(targetElement, filteredPins);
  });
  tokyoPinMap.addEventListener('keydown', function (event) {
    window.util.isEnterEvent(event, toggleActivePin.bind(event));
  });

  window.backend.load(function (response) {
    window.data.ads = response;
    filteredPins = response;
    updatePins(filteredPins);
  }, window.util.errorHandler);

  return pin;
})();
