'use strict';

var offerDialog = document.querySelector('#offer-dialog');
var lodgeTemplate = document.querySelector('#lodge-template').content;
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADS_COUNT = 8;
var i = null;

var getRandomFromRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function createArrayAds(countAds) {
  var arr = [];
  var objectAd = null;
  var offerTitle = null;
  var offerType = null;
  var offerCheckin = null;
  var offerCheckout = null;
  var offerFeatures = null;
  var offerLocationX = null;
  var offerLocationY = null;

  for (i = 1; i <= countAds; i++) {
    offerTitle = OFFER_TITLES[i - 1];
    offerType = OFFER_TYPE[getRandomFromRange(0, OFFER_TYPE.length - 1)];
    offerCheckin = OFFER_CHECKIN[getRandomFromRange(0, OFFER_CHECKIN.length - 1)];
    offerCheckout = OFFER_CHECKOUT[getRandomFromRange(0, OFFER_CHECKOUT.length - 1)];
    offerFeatures = OFFER_FEATURES.slice(getRandomFromRange(0, OFFER_FEATURES.length - 1));
    offerLocationX = getRandomFromRange(300, 900);
    offerLocationY = getRandomFromRange(100, 500);

    objectAd = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: offerTitle,
        address: offerLocationX + ', ' + offerLocationY,
        price: getRandomFromRange(1000, 1000000),
        type: offerType,
        rooms: getRandomFromRange(1, 5),
        guests: getRandomFromRange(1, 8),
        checkin: offerCheckin,
        checkout: offerCheckout,
        features: offerFeatures,
        description: '',
        photos: []
      },
      location: {
        x: offerLocationX,
        y: offerLocationY
      }
    };

    arr.push(objectAd);
  }

  return arr;
}

var ads = createArrayAds(ADS_COUNT);

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

var generatePins = function () {
  var pinsFragment = document.createDocumentFragment();

  for (i = 0; i < ads.length; i++) {
    pinsFragment.appendChild(generatePinElement(ads[i]));
  }

  return pinsFragment;
};

document.querySelector('.tokyo__pin-map').appendChild(generatePins());

var renderFeatures = function (features) {
  var featuresFragment = document.createDocumentFragment();
  var featuresElement = null;

  for (i = 0; i < features.length; i++) {
    featuresElement = document.createElement('span');
    featuresElement.className = 'feature__image feature__image--' + features[i];
    featuresFragment.appendChild(featuresElement);
  }

  return featuresFragment;
};

var generateLodgeElement = function (ad) {
  var lodgeElement = lodgeTemplate.cloneNode(true);
  var offerType = null;

  if (ad.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (ad.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (ad.offer.type === 'house') { // Можно заменить `else if` на `else` эту конструкцию заменить на 'switch case'?
    offerType = 'Дом';
  }

  lodgeElement.querySelector('.lodge__title').textContent = ad.offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = ad.offer.address;
  lodgeElement.querySelector('.lodge__price').innerHTML = ad.offer.price + ' &#x20bd;/ночь';
  lodgeElement.querySelector('.lodge__type ').textContent = offerType;
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + ad.offer.guests + ' гостей в ' + ad.offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  lodgeElement.querySelector('.lodge__features').appendChild(renderFeatures(ad.offer.features));
  lodgeElement.querySelector('.lodge__description').textContent = ad.offer.description;
  lodgeElement.querySelector('.lodge__description').textContent = ad.offer.description;

  // offerDialog.querySelector('.dialog__title > img').src = ad.author.avatar;

  return lodgeElement;
};

offerDialog.replaceChild(generateLodgeElement(ads[0]), offerDialog.querySelector('.dialog__panel'));
offerDialog.querySelector('.dialog__title > img').src = ads[0].author.avatar; // Не знаю, можно ли эту строку перенести в функцию `generateLodgeElement`
