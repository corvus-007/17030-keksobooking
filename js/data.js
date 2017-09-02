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

  var _getRandomFromRange = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };
  var _getRandomItem = function (array) {
    return array[_getRandomFromRange(0, array.length - 1)];
  };
  var _sliceRandomItems = function (array) {
    return array.slice(_getRandomFromRange(0, array.length - 1));
  };
  var _generateAdsArray = function (data, adsCount) {
    var arr = [];
    var offerLocationX = null;
    var offerLocationY = null;

    for (var i = 1; i <= adsCount; i++) {
      offerLocationX = _getRandomFromRange(300, 900);
      offerLocationY = _getRandomFromRange(100, 500);

      arr.push({
        author: {
          avatar: 'img/avatars/user0' + i + '.png'
        },
        offer: {
          title: data.titles[i - 1],
          address: offerLocationX + ', ' + offerLocationY,
          price: _getRandomFromRange(1000, 1000000),
          type: _getRandomItem(data.types),
          rooms: _getRandomFromRange(1, 5),
          guests: _getRandomFromRange(1, 8),
          checkin: _getRandomItem(data.checkin),
          checkout: _getRandomItem(data.checkout),
          features: _sliceRandomItems(data.features),
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
    ads: _generateAdsArray(OFFER_MOCK_DATA, ADS_COUNT)
  };
})();
