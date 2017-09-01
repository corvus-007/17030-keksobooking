'use strict';

(function () {
  var init = function () {
    var OFFER_MOCK_DATA = {
      titles: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'
      ],
      types: ['flat', 'house', 'bungalo'],
      checkin: ['12:00', '13:00', '14:00'],
      checkout: ['12:00', '13:00', '14:00'],
      features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
    };
    var ADS_COUNT = 8;
    var KEYCODES = {
      enter: 13,
      esc: 27
    };
    var CAPACITY_NUMBERS = {
      1: ['1'],
      2: ['1', '2'],
      3: ['1', '2', '3'],
      100: ['0']
    };

    var tokioPinMap = document.querySelector('.tokyo__pin-map');
    var dialog = document.querySelector('#offer-dialog');
    var dialogClose = dialog.querySelector('.dialog__close');
    var ads = generateAdsArray(OFFER_MOCK_DATA, ADS_COUNT);
    var noticeForm = document.querySelector('.notice__form');
    var formSubmit = noticeForm.querySelector('.form__submit');
    var noticeTimein = noticeForm.elements.timein;
    var noticeTimeout = noticeForm.elements.timeout;
    var noticeType = noticeForm.elements.type;
    var noticePrice = noticeForm.elements.price;
    var noticeRooms = noticeForm.elements.rooms;
    var noticeCapacity = noticeForm.elements.capacity;

    var adjustTimeValue = function (adjacentElement, value) {
      adjacentElement.selectedIndex = value;
    };
    var onDialogEscPress = function (event) {
      if (event.keyCode === KEYCODES.esc) {
        closeDialog();
      }
    };
    var openDialog = function () {
      dialog.hidden = false;
      document.addEventListener('keydown', onDialogEscPress);
    };
    var closeDialog = function () {
      var activePin = document.querySelector('.pin--active');

      if (activePin) {
        activePin.classList.remove('pin--active');
      }

      dialog.hidden = true;
      document.removeEventListener('keydown', onDialogEscPress);
    };
    var toggleActivePin = function (event) {
      var targetElement = event.target;

      while (targetElement !== tokioPinMap) {
        if (targetElement.classList.contains('pin')) {
          var pins = tokioPinMap.querySelectorAll('.pin:not(.pin__main)');

          for (var i = 0; i < pins.length; i++) {
            pins[i].classList.remove('pin--active');

            if (pins[i] === targetElement) {
              targetElement.classList.add('pin--active');
              renderOfferDialog(dialog, ads[i]);
              openDialog();
            }
          }
          return;
        }
        targetElement = targetElement.parentNode;
      }
    };
    var checkFormValitidy = function (form) {
      var element = null;

      for (var i = 0; i < form.elements.length; i++) {
        element = form.elements[i];
        if (!element.checkValidity()) {
          element.style.borderColor = 'red';
        } else {
          element.style = '';
        }
      }
    };
    var setSelected = function (select, value) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value) {
          select.options[i].selected = true;
          break;
        }
      }
    };
    var setCapacityValues = function (roomsValue) {
      var isSelected = false;

      for (var i = 0; i < noticeCapacity.length; i++) {
        noticeCapacity[i].disabled = !CAPACITY_NUMBERS[roomsValue].includes(noticeCapacity[i].value);
        if (!isSelected && !noticeCapacity[i].disabled) {
          noticeCapacity[i].selected = true;
          isSelected = !isSelected;
        }
      }
    };
    var checkFormFields = function (form) {
      for (var i = 0; i < form.elements.length; i++) {
        (function (element) {
          element.addEventListener('input', function (event) {
            var field = event.target;

            if (!field.validity.valid) {
              field.style.borderColor = 'red';
            } else {
              field.style = '';
            }
          });
        })(form.elements[i]);
      }
    };

    setCapacityValues(noticeRooms.value);
    checkFormFields(noticeForm);

    noticeTimein.addEventListener('change', function (event) {
      adjustTimeValue(noticeTimeout, event.target.selectedIndex);
    });
    noticeTimeout.addEventListener('change', function (event) {
      adjustTimeValue(noticeTimein, event.target.selectedIndex);
    });
    noticeType.addEventListener('change', function (event) {
      var selectedValue = event.target.value;

      switch (selectedValue) {
        case 'bungalo':
          noticePrice.value = 0;
          break;
        case 'flat':
          noticePrice.value = 1000;
          break;
        case 'house':
          noticePrice.value = 5000;
          break;
        case 'palace':
          noticePrice.value = 10000;
          break;
      }
    });

    noticePrice.addEventListener('input', function () {
      var priceValue = event.target.value;

      if (priceValue >= 10000) {
        setSelected(noticeType, 'palace');
      } else if (priceValue >= 5000) {
        setSelected(noticeType, 'house');
      } else if (priceValue >= 1000) {
        setSelected(noticeType, 'flat');
      } else if (priceValue >= 0) {
        setSelected(noticeType, 'bungalo');
      }
    });

    noticeRooms.addEventListener('change', function (event) {
      var roomsValue = event.target.value;

      setCapacityValues(roomsValue);
    });

    formSubmit.addEventListener('click', function () {
      if (!noticeForm.checkValidity()) {
        checkFormValitidy(noticeForm);
      } else {
        setTimeout(function () {
          noticeForm.reset();
        }, 100);
      }
    });

    tokioPinMap.appendChild(generatePins(ads));
    renderOfferDialog(dialog, ads[0]);

    tokioPinMap.addEventListener('click', function (event) {
      toggleActivePin(event);
    });

    tokioPinMap.addEventListener('keydown', function (event) {
      if (event.keyCode === KEYCODES.enter) {
        toggleActivePin(event);
      }
    });

    dialogClose.addEventListener('click', function (event) {
      event.preventDefault();
      closeDialog();
    });
  };

  var getRandomFromRange = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  var getRandomItem = function (array) {
    return array[getRandomFromRange(0, array.length - 1)];
  };

  var sliceRandomItems = function (array) {
    return array.slice(getRandomFromRange(0, array.length - 1));
  };

  var generateAdsArray = function (data, adsCount) {
    var arr = [];
    var offerLocationX = null;
    var offerLocationY = null;

    for (var i = 1; i <= adsCount; i++) {
      offerLocationX = getRandomFromRange(300, 900);
      offerLocationY = getRandomFromRange(100, 500);

      arr.push({
        author: {
          avatar: 'img/avatars/user0' + i + '.png'
        },
        offer: {
          title: data.titles[i - 1],
          address: offerLocationX + ', ' + offerLocationY,
          price: getRandomFromRange(1000, 1000000),
          type: getRandomItem(data.types),
          rooms: getRandomFromRange(1, 5),
          guests: getRandomFromRange(1, 8),
          checkin: getRandomItem(data.checkin),
          checkout: getRandomItem(data.checkout),
          features: sliceRandomItems(data.features),
          description: '',
          photos: []
        },
        location: {
          x: offerLocationX,
          y: offerLocationY
        }
      });
    }

    return arr;
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

  var generateFeatures = function (features) {
    var featuresFragment = document.createDocumentFragment();
    var featuresElement = null;

    for (var i = 0; i < features.length; i++) {
      featuresElement = document.createElement('span');
      featuresElement.className = 'feature__image feature__image--' + features[i];
      featuresFragment.appendChild(featuresElement);
    }

    return featuresFragment;
  };

  var getOfferType = function (type) {
    var offerType = null;

    switch (type) {
      case 'flat':
        offerType = 'Квартира';
        break;
      case 'bungalo':
        offerType = 'Бунгало';
        break;
      case 'house':
        offerType = 'Дом';
        break;
    }

    return offerType;
  };

  var renderOfferDialog = function (offerContainer, ad) {
    offerContainer.replaceChild(generateLodgeElement(ad), offerContainer.querySelector('.dialog__panel'));
    offerContainer.querySelector('.dialog__title > img').src = ad.author.avatar;
  };

  var generateLodgeElement = function (ad) {
    var lodgeTemplate = document.querySelector('#lodge-template').content;
    var lodgeElement = lodgeTemplate.cloneNode(true);

    lodgeElement.querySelector('.lodge__title').textContent = ad.offer.title;
    lodgeElement.querySelector('.lodge__address').textContent = ad.offer.address;
    lodgeElement.querySelector('.lodge__price').textContent = ad.offer.price + ' ₽/ночь';
    lodgeElement.querySelector('.lodge__type ').textContent = getOfferType(ad.offer.type);
    lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + ad.offer.guests + ' гостей в ' + ad.offer.rooms + ' комнатах';
    lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    lodgeElement.querySelector('.lodge__features').appendChild(generateFeatures(ad.offer.features));
    lodgeElement.querySelector('.lodge__description').textContent = ad.offer.description;
    lodgeElement.querySelector('.lodge__description').textContent = ad.offer.description;

    return lodgeElement;
  };

  init();
})();
