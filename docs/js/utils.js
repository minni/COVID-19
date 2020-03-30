$(function(){
  $.base_hist_options = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: { display: false },
      tooltips: { mode: 'index', intersect: true },
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
    },
    data: {
      datasets: []
    }
  };

  $.variabili = {
    it_vars: {
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
    },
    wl_vars: {
      confirmed: 'Totale casi',
      deaths: 'Deceduti',
      recovered: 'Terapia intensiva',
    }
  };

  $.popolazione = {
    // MOLTIPLICO I MILIONI PER 10 per avere la percentuale su 100.000
    italia: (  60.359546 * 10),
    mondo:  (7400        * 10),
    // REGIONI
    '3':    (10060574 / 100000), // Lombardia             10.060.574
    '12':   ( 5879082 / 100000), // Lazio                  5.879.082
    '15':   ( 5801692 / 100000), // Campania               5.801.692
    '19':   ( 4999891 / 100000), // Sicilia                4.999.891
    '5':    ( 4905854 / 100000), // Veneto                 4.905.854
    '8':    ( 4459477 / 100000), // Emilia-Romagna         4.459.477
    '1':    ( 4356406 / 100000), // Piemonte               4.356.406
    '16':   ( 4029053 / 100000), // Puglia                 4.029.053
    '9':    ( 3729641 / 100000), // Toscana                3.729.641
    '18':   ( 1947131 / 100000), // Calabria               1.947.131
    '20':   ( 1639591 / 100000), // Sardegna               1.639.591
    '7':    ( 1550640 / 100000), // Liguria                1.550.640
    '11':   ( 1525271 / 100000), // Marche                 1.525.271
    '13':   ( 1311580 / 100000), // Abruzzo                1.311.580
    '6':    ( 1215220 / 100000), // Friuli Venezia Giulia  1.215.220
    '10':   (  882015 / 100000), // Umbria                   882.015
    '17':   (  562869 / 100000), // Basilicata               562.869
    '14':   (  305617 / 100000), // Molise                   305.617
    '2':    (  125666 / 100000), // Valle d'Aosta            125.666
    '4':    (  531178 / 100000), // BOLZANO
  };
});