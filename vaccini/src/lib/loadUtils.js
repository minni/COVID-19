var fetchJson = function(url, destination, onComplete){
  fetch(url)
    .then(response => response.json())
    .then(data => {
      window[destination] = data;
      onComplete();
    });
};
var fetchText = function(url, destination, onComplete){
  fetch(url)
    .then(response => response.text())
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

var caricaMondo = function(onComplete){
  var url_casi     = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  var url_morti    = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
  var url_ricoveri = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';
  fetchText(url_casi, 'mondo_casi', function(){
    fetchText(url_morti, 'mondo_morti', function(){
      fetchText(url_ricoveri, 'mondo_ricoveri', function(){
        mondoCsvToJson();
        onComplete();
      });
    });
  });
};

var mondoCsvToJson = function(){
  window.mondo = {};
  singleCsvToJson(window.mondo_casi, 'casi');
  singleCsvToJson(window.mondo_morti, 'morti');
  singleCsvToJson(window.mondo_ricoveri, 'ricoveri');
  window.mondo = Object.values(window.mondo);
  // window.mondo_casi     = false;
  // window.mondo_morti    = false;
  // window.mondo_ricoveri = false;
};

var singleCsvToJson = function(dati_csv, campo){
  if (!dati_csv) return false;
  
  var lines = dati_csv.split("\n");
  var headers = lines[0].split(",");

  for(var h=4; h<headers.length; h++){
    var data = headers[h];
    var giorno, mese, anno;
    [mese, giorno, anno] = data.split('/');
    headers[h] = ('20' + anno + '-' + ("00" + mese).slice(-2) + '-' + ("00" + giorno).slice(-2));
  }

  for(var i=1; i<lines.length; i++){
    // ELIMINO GLI STATI US, as esempio "Lancaster, SC",US
    var currentline = lines[i].replace(/".*"/, '').split(",");
    var area = currentline[0];
    var country = currentline[1];

    if (country) {
      var prev = 0;
      for(var j=4; j<headers.length; j++){
        // var data = headers[j];
        var chiave = `${area}-${country}-${headers[j]}`;
        if (!window.mondo[chiave]) window.mondo[chiave] = {
          area: area,
          country: country,
          data: headers[j],
          casi: 0,
          morti: 0,
          ricoveri: 0,
          max_casi: 0,
          max_morti: 0,
          max_ricoveri: 0,
        };
        // I DATI SONO INCREMENTALI, LI RENDO PUNTUALI
        var tmp = parseInt(currentline[j]);
        if (tmp > 0) {
          window.mondo[chiave][`max_${campo}`] += tmp - prev;
          window.mondo[chiave][campo] += (tmp - prev);
          prev = tmp;
        }
      }
    }
  }
}

export {
  caricaConsegne, caricaVaccinazioni, caricaMondo
};