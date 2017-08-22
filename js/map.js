'use strict';

(function () {
  var init = function () {
    var OFFER_MOCK_DATA = {
      TITLES: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'
      ],
      TYPES: ['flat', 'house', 'bungalo'],
      CHECKIN: ['12:00', '13:00', '14:00'],
      CHECKOUT: ['12:00', '13:00', '14:00'],
      FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
    };
    var ADS_COUNT = 8;

    var offerDialog = document.querySelector('#offer-dialog');
    var ads = generateAdsArray(OFFER_MOCK_DATA, ADS_COUNT);

    document.querySelector('.tokyo__pin-map').appendChild(generatePins(ads));
    renderOfferDialog(offerDialog, ads);
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

  var generateAdsArray = function (data, countAds) {
    var arr = [];
    var offerLocationX = null;
    var offerLocationY = null;

    for (var i = 1; i <= countAds; i++) {
      offerLocationX = getRandomFromRange(300, 900);
      offerLocationY = getRandomFromRange(100, 500);

      arr.push({
        author: {
          avatar: 'img/avatars/user0' + i + '.png'
        },
        offer: {
          title: data.TITLES[i - 1],
          address: offerLocationX + ', ' + offerLocationY,
          price: getRandomFromRange(1000, 1000000),
          type: getRandomItem(data.TYPES),
          rooms: getRandomFromRange(1, 5),
          guests: getRandomFromRange(1, 8),
          checkin: getRandomItem(data.CHECKIN),
          checkout: getRandomItem(data.CHECKOUT),
          features: sliceRandomItems(data.FEATURES),
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

  var renderOfferDialog = function (offerContainer, adsArray) {
    offerContainer.replaceChild(generateLodgeElement(adsArray[0]), offerContainer.querySelector('.dialog__panel'));
    offerContainer.querySelector('.dialog__title > img').src = adsArray[0].author.avatar;
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
