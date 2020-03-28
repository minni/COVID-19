function loadItaNoLomb(ctx, options, perc){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
  $.getJSON(json_url, function(dati_grezzi) {
    // console.log("Dati", dati_grezzi);
    // window.dati_grezzi = dati_grezzi;
    var date = dati_grezzi.map(function(i){return i.data; });
      date = date.filter(function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    });
    options.data.labels = date.map(function(d){
      var giorno, mese, anno, extra;
      [anno, mese, ...giorno] = d.split('-');
      [giorno, ...extra] = giorno[0].split(' ');
      return (giorno + '.' + mese + '.' + anno);
    });

    $('#headerJumbo div h3').html("Italia esclusa Lombardia");
    options.options.title.text = "Italia esclusa Lombardia";

    // IMPOSTO DATASET
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
    var colori = {
      ricoverati_con_sintomi:      window.chartColors.red,
      terapia_intensiva:           window.chartColors.orange,
      totale_ospedalizzati:        window.chartColors.yellow,
      isolamento_domiciliare:      window.chartColors.green,
      totale_attualmente_positivi: window.chartColors.blue,
      nuovi_attualmente_positivi:  window.chartColors.purple,
      dimessi_guariti:             window.chartColors.green2,
      deceduti:                    window.chartColors.grey,
      totale_casi:                 undefined, // window.chartColors.orange,
      tamponi:                     undefined, // window.chartColors.yellow
    };
    var dati_regionali = dati_grezzi.reduce(function(tot, i){
      // console.log("Regione", i.codice_regione, (i.codice_regione == 3 ? 'NO' : 'SI'));
      if (i.codice_regione == 3) return tot;
      if (!tot[i.data]) {
        tot[i.data] = {
          ricoverati_con_sintomi:      0,
          terapia_intensiva:           0,
          totale_ospedalizzati:        0,
          isolamento_domiciliare:      0,
          totale_attualmente_positivi: 0,
          nuovi_attualmente_positivi:  0,
          dimessi_guariti:             0,
          deceduti:                    0,
          totale_casi:                 0,
          tamponi:                     0,
        };
      }
      tot[i.data].ricoverati_con_sintomi      += parseInt(i.ricoverati_con_sintomi     );
      tot[i.data].terapia_intensiva           += parseInt(i.terapia_intensiva          );
      tot[i.data].totale_ospedalizzati        += parseInt(i.totale_ospedalizzati       );
      tot[i.data].isolamento_domiciliare      += parseInt(i.isolamento_domiciliare     );
      tot[i.data].totale_attualmente_positivi += parseInt(i.totale_attualmente_positivi);
      tot[i.data].nuovi_attualmente_positivi  += parseInt(i.nuovi_attualmente_positivi );
      tot[i.data].dimessi_guariti             += parseInt(i.dimessi_guariti            );
      tot[i.data].deceduti                    += parseInt(i.deceduti                   );
      tot[i.data].totale_casi                 += parseInt(i.totale_casi                );
      tot[i.data].tamponi                     += parseInt(i.tamponi                    );
      return tot;
    }, {});
    window.dati_regionali = dati_regionali;
    var popolazione = window.popolazione.italia - window.popolazione['3'];
    for (var [key, value] of Object.entries(variabili)) {
      // console.log(`${key}: ${value}`);
      var prev = 'ND';
      options.data.datasets.push({
        backgroundColor: colori[key],
        borderColor:     colori[key],
        fill: false,
        label: value,
        data: date.map(function(i){
          var value = dati_regionali[i][key];
          if (!value) value = 0;
          if (perc == 'SI') return (Math.round(value / popolazione * 10000) / 10000);
          if (perc == 'TREND') {
            if (prev == 'ND') {
              prev = value;
              return 0;
            }
            if (prev == 0) {
              prev = value;
              return 0;
            }
            var res = (value - prev) / prev;
            prev = value;
            if (res > 1) return 100;
            if (res < -1) return -100;
            return (Math.round(res * 10000) / 100);
          }
          return value;
        })
      });
    }
    options.data.datasets[9].hidden = true;
    // if (!perc) options.data.datasets.push({
    //   backgroundColor: window.chartColors.blue,
    //   borderColor: window.chartColors.blue,
    //   fill: false,
    //   label: 'Popolazione',
    //   data: Array(dati_grezzi.length).fill(window.popolazione.italia),
    //   hidden: true
    // });
    
    window.covidLine = new Chart(ctx, options);
  });
}