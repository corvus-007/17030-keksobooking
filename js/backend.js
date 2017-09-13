'use strict';

window.backend = (function () {
  var URL = 'https://1510.dump.academy/keksobooking';
  var backend = {
    load: load,
    save: save
  };

  function setup(onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      var error;

      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос.';
          break;
        case 404:
          error = 'Ничего не найдено.';
          break;

        default:
          error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
          break;
      }

      if (error) {
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });

    return xhr;
  }

  function load(onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL + '/data');
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  }

  return backend;
})();
