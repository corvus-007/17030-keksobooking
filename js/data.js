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

  var data = {
    ads: generateAdsArray(OFFER_MOCK_DATA, ADS_COUNT)
  };

  function getRandomFromRange(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
  function getRandomItem(array) {
    return array[getRandomFromRange(0, array.length - 1)];
  }
  function sliceRandomItems(array) {
    return array.slice(getRandomFromRange(0, array.length - 1));
  }
  function generateAdsArray(adsData, adsCount) {
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
          title: adsData.titles[i - 1],
          address: offerLocationX + ', ' + offerLocationY,
          price: getRandomFromRange(1000, 1000000),
          type: getRandomItem(adsData.types),
          rooms: getRandomFromRange(1, 5),
          guests: getRandomFromRange(1, 8),
          checkin: getRandomItem(adsData.checkin),
          checkout: getRandomItem(adsData.checkout),
          features: sliceRandomItems(adsData.features),
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
  }

  return data;
})();
