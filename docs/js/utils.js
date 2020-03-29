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
  };
});