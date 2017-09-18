'use strict';

window.pin = (function () {
  var PRICE_RANGE = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
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
    var pins = createPins(adverts);

    Array.from(oldPins).forEach(function (pin) {
      pin.remove();
    });

    window.map.tokyoPinMap.insertBefore(pins, window.map.mainPin);
    window.card.close();
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

  function onTokyoFiltersChange() {
    filteredPins = window.data.ads.filter(function (ad) {
      return fnFilters.every(function (fn) {
        return fn(ad);
      });
    });

    refreshPins();
  }

  tokyoFilters.addEventListener('change', onTokyoFiltersChange);

  function toggleActivePin(event, data) {
    var clickedPin = event.target;
    var activePin = tokyoPinMap.querySelector('.pin--active');
    var pins = tokyoPinMap.querySelectorAll('.pin');

    if (!clickedPin) {
      window.card.close();
      return;
    }

    while (clickedPin !== tokyoPinMap) {
      if (clickedPin.classList.contains('pin__main')) {
        return;
      }

      if (clickedPin.classList.contains('pin')) {
        var clickedPinIndex = Array.from(pins).indexOf(clickedPin);

        if (activePin) {
          activePin.classList.remove('pin--active');
        }

        clickedPin.classList.add('pin--active');
        window.showCard(window.card.dialog, data[clickedPinIndex]);
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
    toggleActivePin(event, filteredPins);
  });

  tokyoPinMap.addEventListener('keydown', function (event) {
    if (event.keyCode === window.util.KEYCODES.ENTER) {
      toggleActivePin(event, filteredPins);
    }
  });

  window.backend.load(function (response) {
    window.data.ads = response;
    filteredPins = response;
    updatePins(filteredPins);
  }, window.util.errorHandler);

})();
