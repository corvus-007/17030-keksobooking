'use strict';

window.map = (function () {
  var dialog = document.querySelector('#offer-dialog');

  window.card.renderOfferDialog(dialog, window.data.ads[0]);
})();
