'use strict';

window.showCard = (function () {
  return function (card, pin) {
    window.card.render(card, pin);
    window.card.open();
  };
})();
