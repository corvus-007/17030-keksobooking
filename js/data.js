'use strict';

window.data = (function () {
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

  return {
    ads: generateAdsArray(OFFER_MOCK_DATA, ADS_COUNT)
  };
})();
