'use strict';

window.map = (function () {
  var dialog = document.querySelector('#offer-dialog');

  window.backend.load(function (response) {
    window.card.renderOfferDialog(dialog, response[0]);
  }, window.util.errorHandler);
})();
