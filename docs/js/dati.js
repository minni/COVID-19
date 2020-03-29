$(function(){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
  $.getJSON(json_url, function(dati_grezzi) {});

  $.caricaDatiProvince = function(){
    if ($.datiProvince) return $.caricaDati();
    var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json";
    $.getJSON(json_url, function(dati_grezzi) {
      $.datiProvince = dati_grezzi.map(function(d){
        d.data_js = new Date(d.data);
        d.data_ymd = d.data.split('T')[0];
        d.data_h = (
          ("00" + d.data_js.getDate()).slice(-2) + '.' +
          ("00" + (d.data_js.getMonth() + 1)).slice(-2) + '.' +
          d.data_js.getYear()
        );
        return d;
      });
      $.caricaDati();
    });
  };

  $.caricaDatiRegioni = function(){
    if ($.datiRegioni) return $.caricaDati();
    var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
    $.getJSON(json_url, function(dati_grezzi) {
      $.datiRegioni = dati_grezzi.map(function(d){
        d.data_js = new Date(d.data);
        d.data_ymd = d.data.split('T')[0];
        d.data_h = (
          ("00" + d.data_js.getDate()).slice(-2) + '.' +
          ("00" + (d.data_js.getMonth() + 1)).slice(-2) + '.' +
          d.data_js.getYear()
        );
        return d;
      });
      $.caricaDati();
    });
  };

  $.caricaDatiMondoConfermati = function(){
    if (Object.values($.datiMondoConf)[0] && Object.values($.datiMondoConf)[0]['confirmed'] != undefined) return $.caricaDati();

    var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
    $.get(csv_url, function(dati_grezzi) {
      $.parseDatiMondoGrezzi(dati_grezzi, 'confirmed');
      $.caricaDati();
    });
  };
  $.caricaDatiMondoMorti = function(){
    if (Object.values($.datiMondoConf)[0] && Object.values($.datiMondoConf)[0]['deaths'   ] != undefined) return $.caricaDati();

    var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
    $.get(csv_url, function(dati_grezzi) {
      $.parseDatiMondoGrezzi(dati_grezzi, 'deaths');
      $.caricaDati();
    });
  }
  $.caricaDatiMondoRicoverati = function(){
    if (Object.values($.datiMondoConf)[0] && Object.values($.datiMondoConf)[0]['recovered'] != undefined) return $.caricaDati();

    var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
    $.get(csv_url, function(dati_grezzi) {
      $.parseDatiMondoGrezzi(dati_grezzi, 'recovered');
      $.caricaDati();
    });
  };

  $.parseDatiMondoGrezzi = function(dati_grezzi, chiave){
    console.log("Carico", chiave);
    if (!$.datiMondoConf) $.datiMondoConf = {};
      
    window.result = $.datiMondoConf;
    window.lines   = dati_grezzi.split("\n");
    window.headers = lines[0].split(",");
    for(var j=4; j<headers.length; j++){
      var data = headers[j];
      var giorno, mese, anno;
      [mese, giorno, anno] = data.split('/');
      headers[j] = ('20' + anno + '-' + ("00" + mese).slice(-2) + '-' + ("00" + giorno).slice(-2));
    }
    
    for(var i=1; i<lines.length; i++){
      // ELIMINO GLI STATI US, as esempio "Lancaster, SC",US
      var currentline = lines[i].replace(/".*"/, '').split(",");
      var country = currentline[1];
      for(var j=4; j<headers.length; j++){
        if (!result[country + '--' + headers[j]]) {
          [y, m, d] = headers[j].split('-');
          result[country + '--' + headers[j]] = {
            data_ymd: headers[j],
            data_h: (d + '.' + m + '.' + y),
            stato: country
          };
        }
        if (!result[country + '--' + headers[j]][chiave]) result[country + '--' + headers[j]][chiave] = 0;
        result[country + '--' + headers[j]][chiave] += parseInt(currentline[j]);
      }
    }
    $.datiMondoConf = result;
  };

  $.caricaDati = function(){
    if ($.viz_area == 'italia') {
      if ($.viz_indici == 'province' && !$.datiProvince) return $.caricaDatiProvince();
      if (!$.datiRegioni) return $.caricaDatiRegioni();
    }
    if ($.viz_area == 'mondo') {
      if (!$.datiMondoConf) $.datiMondoConf = [];
      if (!Object.values($.datiMondoConf)[0] || Object.values($.datiMondoConf)[0]['confirmed'] === undefined) return $.caricaDatiMondoConfermati();
      if (!Object.values($.datiMondoConf)[0] || Object.values($.datiMondoConf)[0]['deaths'   ] === undefined) return $.caricaDatiMondoMorti();
      if (!Object.values($.datiMondoConf)[0] || Object.values($.datiMondoConf)[0]['recovered'] === undefined) return $.caricaDatiMondoRicoverati();
      if (!$.datiMondoConf[0]) $.datiMondoConf = Object.values($.datiMondoConf);
    }
    $.ridisegnaGrafico();
    // $.ridisegnaTabella();
  };
});