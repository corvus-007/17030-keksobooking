'use strict';

window.form = (function () {
  var CAPACITY_NUMBERS = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  var noticeForm = document.querySelector('.notice__form');
  var formSubmit = noticeForm.querySelector('.form__submit');
  var noticeTimein = noticeForm.elements.timein;
  var noticeTimeout = noticeForm.elements.timeout;
  var noticeType = noticeForm.elements.type;
  var noticePrice = noticeForm.elements.price;
  var noticeRooms = noticeForm.elements.rooms;
  var noticeCapacity = noticeForm.elements.capacity;

  var adjustTimeValue = function (adjacentElement, value) {
    adjacentElement.selectedIndex = value;
  };
  var checkFormValitidy = function (form) {
    var element = null;

    for (var i = 0; i < form.elements.length; i++) {
      element = form.elements[i];
      if (!element.checkValidity()) {
        element.style.borderColor = 'red';
      } else {
        element.style = '';
      }
    }
  };
  var setSelected = function (select, value) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) {
        select.options[i].selected = true;
        break;
      }
    }
  };
  var setCapacityValues = function (roomsValue) {
    var isSelected = false;

    for (var i = 0; i < noticeCapacity.length; i++) {
      noticeCapacity[i].disabled = !CAPACITY_NUMBERS[roomsValue].includes(noticeCapacity[i].value);
      if (!isSelected && !noticeCapacity[i].disabled) {
        noticeCapacity[i].selected = true;
        isSelected = !isSelected;
      }
    }
  };
  var checkFormFields = function (form) {
    for (var i = 0; i < form.elements.length; i++) {
      (function (element) {
        element.addEventListener('input', function (event) {
          var field = event.target;

          if (!field.validity.valid) {
            field.style.borderColor = 'red';
          } else {
            field.style = '';
          }
        });
      })(form.elements[i]);
    }
  };

  noticeTimein.addEventListener('change', function (event) {
    adjustTimeValue(noticeTimeout, event.target.selectedIndex);
  });
  noticeTimeout.addEventListener('change', function (event) {
    adjustTimeValue(noticeTimein, event.target.selectedIndex);
  });
  noticeType.addEventListener('change', function (event) {
    var selectedValue = event.target.value;

    switch (selectedValue) {
      case 'bungalo':
        noticePrice.value = 0;
        break;
      case 'flat':
        noticePrice.value = 1000;
        break;
      case 'house':
        noticePrice.value = 5000;
        break;
      case 'palace':
        noticePrice.value = 10000;
        break;
    }
  });

  noticePrice.addEventListener('input', function () {
    var priceValue = event.target.value;

    if (priceValue >= 10000) {
      setSelected(noticeType, 'palace');
    } else if (priceValue >= 5000) {
      setSelected(noticeType, 'house');
    } else if (priceValue >= 1000) {
      setSelected(noticeType, 'flat');
    } else if (priceValue >= 0) {
      setSelected(noticeType, 'bungalo');
    }
  });

  noticeRooms.addEventListener('change', function (event) {
    var roomsValue = event.target.value;

    setCapacityValues(roomsValue);
  });

  formSubmit.addEventListener('click', function () {
    if (!noticeForm.checkValidity()) {
      checkFormValitidy(noticeForm);
    } else {
      setTimeout(function () {
        noticeForm.reset();
      }, 100);
    }
  });

  setCapacityValues(noticeRooms.value);
  checkFormFields(noticeForm);
})();
