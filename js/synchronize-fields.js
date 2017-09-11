'use strict';

window.synchronizeFields = (function () {
  return function (firstField, secondField, firstData, secondData, callback) {
    var firstValueIndex = firstData.indexOf(firstField.value);
    var value = secondData[firstValueIndex];

    callback(secondField, value);
  };
})();
