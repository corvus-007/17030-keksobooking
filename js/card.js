'use strict';

window.card = (function () {
  var dialog = document.querySelector('#offer-dialog');
  var dialogClose = dialog.querySelector('.dialog__close');

  var card = {
    renderOfferDialog: renderOfferDialog,
    openDialog: openDialog,
    closeDialog: closeDialog
  };

  function generateLodgeElement(ad) {
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
  }

  function generateFeatures(features) {
    var featuresFragment = document.createDocumentFragment();
    var featuresElement = null;

    for (var i = 0; i < features.length; i++) {
      featuresElement = document.createElement('span');
      featuresElement.className = 'feature__image feature__image--' + features[i];
      featuresFragment.appendChild(featuresElement);
    }

    return featuresFragment;
  }

  function getOfferType(type) {
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
  }

  function onDialogEscPress(event) {
    window.util.isEscEvent(event, window.card.closeDialog);
  }

  function renderOfferDialog(offerContainer, ad) {
    offerContainer.replaceChild(generateLodgeElement(ad), offerContainer.querySelector('.dialog__panel'));
    offerContainer.querySelector('.dialog__title > img').src = ad.author.avatar;
  }

  function openDialog() {
    dialog.hidden = false;
    document.addEventListener('keydown', onDialogEscPress);
  }

  function closeDialog() {
    var activePin = document.querySelector('.pin--active');

    if (activePin) {
      activePin.classList.remove('pin--active');
    }

    dialog.hidden = true;
    document.removeEventListener('keydown', onDialogEscPress);
  }

  dialogClose.addEventListener('click', function (event) {
    event.preventDefault();
    card.closeDialog();
  });

  return card;
})();
