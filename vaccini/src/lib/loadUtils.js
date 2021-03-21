var fetchJson = function(url, destination, onComplete){
  fetch(url)
    .then(response => response.json())
    .then(data => {
      window[destination] = data;
      onComplete();
    });
};

var caricaConsegne = function(onComplete){
  fetchJson(
    "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/consegne-vaccini-latest.json",
    'consegne',
    onComplete
  );
};

var caricaVaccinazioni = function(onComplete){
  fetchJson(
    "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.json",
    'vaccinazioni',
    onComplete
  );
};

export {
  caricaConsegne, caricaVaccinazioni
};