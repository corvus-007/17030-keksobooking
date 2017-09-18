'use strict';

window.form = (function () {
  var CAPACITY_NUMBERS = ['1', ['1', '2'],
    ['1', '2', '3'], '0'
  ];
  var noticeForm = document.querySelector('.notice__form');
  var formSubmit = noticeForm.querySelector('.form__submit');
  var noticeTimein = noticeForm.elements.timein;
  var noticeTimeout = noticeForm.elements.timeout;
  var noticeType = noticeForm.elements.type;
  var noticePrice = noticeForm.elements.price;
  var noticeRooms = noticeForm.elements.rooms;
  var noticeCapacity = noticeForm.elements.capacity;
  var noticeAddresss = noticeForm.elements.address;

  var form = {
    setNoticeAddress: setNoticeAddress
  };

  function checkFormElement(element) {
    element.style.borderColor = element.checkValidity() ? '' : 'red';
  }

  function checkFormValitidy(formElement) {
    Array.from(formElement.elements).forEach(checkFormElement);
  }

  function syncCapacityValues(element, value) {
    var isSelected = false;

    for (var i = 0; i < element.length; i++) {
      element[i].disabled = !value.includes(element[i].value);
      if (!isSelected && !element[i].disabled) {
        element[i].selected = true;
        isSelected = !isSelected;
      }
    }
  }

  function setNoticeAddress() {
    noticeAddresss.value = 'x: ' + window.map.getMainPinCoords().x + 'px, y: ' + window.map.getMainPinCoords().y + 'px';
  }

  function syncValues(element, value) {
    element.value = value;
  }

  function syncValueWithMin(element, value) {
    element.min = value;
  }

  function setDefaultFields() {
    window.synchronizeFields(noticeRooms, noticeCapacity, ['1', '2', '3', '100'], CAPACITY_NUMBERS, syncCapacityValues);
    form.setNoticeAddress();
  }

  noticeTimein.addEventListener('change', function () {
    window.synchronizeFields(noticeTimein, noticeTimeout, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
  });

  noticeTimeout.addEventListener('change', function () {
    window.synchronizeFields(noticeTimeout, noticeTimein, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
  });

  noticeType.addEventListener('change', function () {
    window.synchronizeFields(noticeType, noticePrice, ['bungalo', 'flat', 'house', 'palace'], [0, 1000, 5000, 10000], syncValueWithMin);
  });

  noticeRooms.addEventListener('change', function () {
    window.synchronizeFields(noticeRooms, noticeCapacity, ['1', '2', '3', '100'], CAPACITY_NUMBERS, syncCapacityValues);
  });

  formSubmit.addEventListener('click', function () {
    if (!noticeForm.checkValidity()) {
      checkFormValitidy(noticeForm);
    }
  });

  setDefaultFields();

  Array.from(noticeForm.elements).forEach(function (element) {
    element.addEventListener('input', function () {
      checkFormElement(element);
    });
  });

  noticeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    window.backend.save(new FormData(noticeForm), function () {
      noticeForm.reset();
      setDefaultFields();
    }, window.util.errorHandler);
  });

  return form;
})();
