window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
};
window.popolazione = {
  italia: 60359546,
  '3':  10060574, // Lombardia             10.060.574
  '12':  5879082, // Lazio                  5.879.082
  '15':  5801692, // Campania               5.801.692
  '19':  4999891, // Sicilia                4.999.891
  '5':   4905854, // Veneto                 4.905.854
  '8':   4459477, // Emilia-Romagna         4.459.477
  '1':   4356406, // Piemonte               4.356.406
  '16':  4029053, // Puglia                 4.029.053
  '9':   3729641, // Toscana                3.729.641
  '18':  1947131, // Calabria               1.947.131
  '20':  1639591, // Sardegna               1.639.591
  '7':   1550640, // Liguria                1.550.640
  '11':  1525271, // Marche                 1.525.271
  '13':  1311580, // Abruzzo                1.311.580
  '6':   1215220, // Friuli Venezia Giulia  1.215.220
  '10':   882015, // Umbria                   882.015
  '17':   562869, // Basilicata               562.869
  '14':   305617, // Molise                   305.617
  '2':    125666, // Valle d'Aosta            125.666
  '4':    531178, // BOLZANO
  // '': 1.072.276, Trentino-Alto Adige
};

window.onload = function() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var options = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: { display: false },
      tooltips: { mode: 'index', intersect: false },
      hover: { mode: 'nearest', intersect: false },
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: { display: true, labelString: 'Giorni' }
        }],
        yAxes: [{
          display: true,
          scaleLabel: { display: true, labelString: 'Persone' }
        }]
      }
    }
  };
  options.data = {};
  options.data.datasets = [];

  var query = getUrlVars();
  var perc = (query.perc == 'SI' ? true : false);
  if (perc) options.options.scales.yAxes[0].scaleLabel.labelString = 'Perc. su 10.000';
  if (perc) {
    $('.jumboTitle div.btn-group a.perc').addClass('btn-primary');
    $('.jumboTitle div.btn-group a.abs').addClass('btn-outline-secondary');
    $('#divDropRegioni a, #divDropProvince a').each(function() {
       $(this).attr("href", $(this).attr("href") + "&perc=SI");
    });
    $('a[href="?stato=ITA"]').each(function() {
       $(this).attr("href", $(this).attr("href") + "&perc=SI");
    });
  } else {
    $('.jumboTitle div.btn-group a.perc').addClass('btn-outline-primary');
    $('.jumboTitle div.btn-group a.abs').addClass('btn-secondary');
  }
  if (query.mondo) {
    $('#menu_province').hide();
    $('.jumboTitle div.btn-group').hide();
    loadMondo(ctx, options, query.mondo);
  } else if (query.codice_provincia) {
    $('.jumboTitle div.btn-group').hide();
    loadProvincia(ctx, options, query.codice_provincia, perc);
  } else if (query.codice_regione) {
    $('.jumboTitle div.btn-group a.perc').attr('href',
      ('?codice_regione=' + query.codice_regione + '&perc=SI')
    );
    $('.jumboTitle div.btn-group a.abs').attr('href',
      ('?codice_regione=' + query.codice_regione)
    );
    loadRegione(ctx, options, query.codice_regione, perc);
  } else {
    $('#menu_province').hide();
    $('.jumboTitle div.btn-group a.perc').attr('href', '?perc=SI');
    $('.jumboTitle div.btn-group a.abs').attr('href', '?');
    loadNazionali(ctx, options, perc);
  }
};

// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function loadNazionali(ctx, options, perc){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json";
  $('#status').html('Importo dati Nazionali JSON da <pre>'+json_url+'</pre>');
  $.getJSON(json_url, function(dati_grezzi) {
    // console.log("Dati", dati_grezzi);
    // window.dati_grezzi = dati_grezzi;

    // IMPOSTO IL TITOLO
    options.options.title.text = "Andamento COVID in Italia";

    // IMPOSTO ETICHETTE
    $('#status').html('Carico etichette dei giorni');
    var date = dati_grezzi.map(function(i){return i.data; });
    options.data.labels = date.map(function(d){
      var giorno, mese, anno, extra;
      [anno, mese, ...giorno] = d.split('-');
      [giorno, ...extra] = giorno[0].split(' ');
      return (giorno + '.' + mese + '.' + anno);
    });

    // IMPOSTO DATASET
    $('#status').html('Filtro e carico i dati giornalieri');
    var variabili = {
      ricoverati_con_sintomi: 'Ricoverati con sintomi',
      terapia_intensiva: 'Terapia intensiva',
      totale_ospedalizzati: 'Totale ospedalizzati',
      isolamento_domiciliare: 'Isolamento domiciliare',
      totale_attualmente_positivi: 'Totale attualmente positivi',
      nuovi_attualmente_positivi: 'Nuovi attualmente positivi',
      dimessi_guariti: 'Dimessi guariti',
      deceduti: 'Deceduti',
      totale_casi: 'Totale casi',
      tamponi: 'Tamponi',
    };
    var idx = 0;
    for (var [key, value] of Object.entries(variabili)) {
      // console.log(`${key}: ${value}`);
      options.data.datasets.push({
        backgroundColor: Object.values(window.chartColors)[idx],
        borderColor: Object.values(window.chartColors)[idx],
        fill: false,
        label: value,
        data: dati_grezzi.map(function(i){
          var value = (i[key] ? i[key] : 0);
          if (perc) return (Math.round(value / (window.popolazione.italia / 10000) * 10000) / 10000);
          return value;
        })
      });
      idx = idx + 1;
    }
    options.data.datasets[9].hidden = true;
    if (!perc) options.data.datasets.push({
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      fill: false,
      label: 'Popolazione',
      data: Array(dati_grezzi.length).fill(window.popolazione.italia),
      hidden: true
    });
        
    $('#status').html('Genero il grafico');
    window.covidLine = new Chart(ctx, options);
    $('#status').hide();
  });
}

function loadRegione(ctx, options, cod, perc){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
  $('#status').html('Importo dati Regionali JSON da <pre>'+json_url+'</pre>');
  $.getJSON(json_url, function(dati_grezzi) {
    // console.log("Dati", dati_grezzi);
    window.dati_grezzi = dati_grezzi;

    // // CARICO REGIONI
    // $('#status').html('Carico Regioni');
    // var regioni = dati_grezzi.map(function(i){return i.codice_regione; });
    // regioni = regioni.filter(function onlyUnique(value, index, self) { 
    //   return self.indexOf(value) === index;
    // });
    // var res = '';
    // regioni.map(function(r){
    //   var lbl = dati_grezzi.find(function(el){ return el.codice_regione == r; });
    //   lbl = lbl.denominazione_regione;
    //   res += '<a class="dropdown-item" href="?codice_regione=' + r + '">' + lbl + '</a>';
    // });
    // $('div[aria-labelledby="dropRegioni"]').html(res);

    // CARICO DATE
    $('#status').html('Carico date');
    var date = dati_grezzi.map(function(i){return i.data; });
    // DATE UNICHE
    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates?answertab=votes#tab-top
    date = date.filter(function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    });
    
    // FILTRO PER REGIONE
    $('#status').html('Filtro dati regione');
    dati_grezzi = dati_grezzi.filter(function(d){
      return d.codice_regione == cod;
    });

    // IMPOSTO IL TITOLO
    var regione = dati_grezzi[0].denominazione_regione;
    $('#dropRegioni').html(regione);
    $('#dropRegioni').attr('href', '?codice_regione=' + cod);
    // $('#dropRegioni').removeClass('dropdown-toggle');
    // $('div[aria-labelledby="dropRegioni"]').remove();
    $('div[aria-labelledby="dropProvince"] a[cod_reg!="'+cod+'"]').hide();
    $('#headerJumbo div h3').html("Regione: " + regione);
    options.options.title.text = "Andamento COVID in " + regione;

    // IMPOSTO ETICHETTE
    $('#status').html('Carico etichette dei giorni');
    options.data.labels = date.map(function(d){
      var giorno, mese, anno, extra;
      [anno, mese, ...giorno] = d.split('-');
      [giorno, ...extra] = giorno[0].split(' ');
      return (giorno + '.' + mese + '.' + anno);
    });
    
    // IMPOSTO DATASET
    $('#status').html('Filtro e carico i dati giornalieri');
    var variabili = {
      ricoverati_con_sintomi: 'Ricoverati con sintomi',
      terapia_intensiva: 'Terapia intensiva',
      totale_ospedalizzati: 'Totale ospedalizzati',
      isolamento_domiciliare: 'Isolamento domiciliare',
      totale_attualmente_positivi: 'Totale attualmente positivi',
      nuovi_attualmente_positivi: 'Nuovi attualmente positivi',
      dimessi_guariti: 'Dimessi guariti',
      deceduti: 'Deceduti',
      totale_casi: 'Totale casi',
      tamponi: 'Tamponi',
    };
    var idx = 0;
    for (var [key, value] of Object.entries(variabili)) {
      // console.log(`${key}: ${value}`);
      options.data.datasets.push({
        backgroundColor: Object.values(window.chartColors)[idx],
        borderColor: Object.values(window.chartColors)[idx],
        fill: false,
        label: value,
        data: date.map(function(i){
          var dato = dati_grezzi.find(function(el){ return el.data == i; });
          var value = (dato[key] ? dato[key] : 0);
          if (perc) return (Math.round(value / (window.popolazione[cod] / 10000) * 10000) / 10000);
          return value;
        })
      });
      idx = idx + 1;
    }
    options.data.datasets[9].hidden = true;
    if (!perc) options.data.datasets.push({
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      fill: false,
      label: 'Popolazione',
      data: Array(date.length).fill(window.popolazione[cod]),
      hidden: true
    });
    
    $('#status').html('Genero il grafico');
    window.covidLine = new Chart(ctx, options);
    $('#status').hide();
  });
}

function loadProvincia(ctx, options, cod, perc){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json";
  $('#status').html('Importo dati Provinciali JSON da <pre>'+json_url+'</pre>');
  $.getJSON(json_url, function(dati_grezzi) {
    // console.log("Dati", dati_grezzi);
    // window.dati_grezzi = dati_grezzi;

    // // CARICO PROVINCE
    // $('#status').html('Carico Regioni');
    // var province = dati_grezzi.map(function(i){return i.codice_provincia; });
    // province = province.filter(function onlyUnique(value, index, self) { 
    //   return self.indexOf(value) === index;
    // });
    // var res = '';
    // province.map(function(r){
    //   var prov = dati_grezzi.find(function(el){ return el.codice_provincia == r; });
    //   res += '<a class="dropdown-item" cod_reg="' + 
    //     prov.codice_regione + '" href="?codice_provincia=' + r + '">' +
    //     prov.denominazione_provincia + '</a>';
    // });
    // $('div[aria-labelledby="dropProvince"]').html(res);

    // CARICO DATE
    $('#status').html('Carico date');
    var date = dati_grezzi.map(function(i){return i.data; });
    // DATE UNICHE
    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates?answertab=votes#tab-top
    date = date.filter(function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    });
    
    // FILTRO PER REGIONR
    $('#status').html('Filtro dati provincia');
    dati_grezzi = dati_grezzi.filter(function(d){
      return d.codice_provincia == cod;
    });

    // IMPOSTO IL TITOLO
    var regione   = dati_grezzi[0].denominazione_regione;
    var cod_reg   = dati_grezzi[0].codice_regione;
    var provincia = dati_grezzi[0].denominazione_provincia;
    $('#dropRegioni').html(regione);
    // $('#dropRegioni').attr('href', '?codice_regione=' + cod);
    // $('#dropRegioni').removeClass('dropdown-toggle');
    $('#dropProvince').html(provincia);
    $('div[aria-labelledby="dropProvince"] a[cod_reg!="'+cod_reg+'"]').hide();
    // $('div[aria-labelledby="dropProvince"] a[data-cod_reg!="' + cod_reg + '"]').hide();
    $('#headerJumbo div h3').html("Provincia: " + provincia + " (" + regione + ")");
    options.options.title.text = "Andamento COVID in " + provincia + " (" + regione + ")";

    // IMPOSTO ETICHETTE
    $('#status').html('Carico etichette dei giorni');
    options.data.labels = date.map(function(d){
      var giorno, mese, anno, extra;
      [anno, mese, ...giorno] = d.split('-');
      [giorno, ...extra] = giorno[0].split(' ');
      return (giorno + '.' + mese + '.' + anno);
    });
    
    // IMPOSTO DATASET
    $('#status').html('Filtro e carico i dati giornalieri');
    var variabili = {
      // ricoverati_con_sintomi: 'Ricoverati con sintomi',
      // terapia_intensiva: 'Terapia intensiva',
      // totale_ospedalizzati: 'Totale ospedalizzati',
      // isolamento_domiciliare: 'Isolamento domiciliare',
      // totale_attualmente_positivi: 'Totale attualmente positivi',
      // nuovi_attualmente_positivi: 'Nuovi attualmente positivi',
      // dimessi_guariti: 'Dimessi guariti',
      // deceduti: 'Deceduti',
      totale_casi: 'Totale casi',
      // tamponi: 'Tamponi',
    };
    var idx = 0;
    for (var [key, value] of Object.entries(variabili)) {
      // console.log(`${key}: ${value}`);
      options.data.datasets.push({
        backgroundColor: Object.values(window.chartColors)[idx],
        borderColor: Object.values(window.chartColors)[idx],
        fill: false,
        label: value,
        data: date.map(function(i){
          var dato = dati_grezzi.find(function(el){ return el.data == i; });
          return (dato[key] ? dato[key] : 0);
        })
      });
      idx = idx + 1;
    }
    
    $('#status').html('Genero il grafico');
    window.covidLine = new Chart(ctx, options);
    $('#status').hide();
  });
}