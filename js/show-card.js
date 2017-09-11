'use strict';

window.showCard = (function () {
  return function (card, pin) {
    window.card.renderOfferDialog(card, pin);
    window.card.openDialog();
  };
})();
