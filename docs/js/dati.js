$(function(){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
  $.getJSON(json_url, function(dati_grezzi) {});

  $.caricaDatiProvince = function(){
    var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json";
    $.getJSON(json_url, function(dati_grezzi) {
      $.datiProvince = dati_grezzi.map(function(d){
        d.data_js = new Date(d.data);
        return d;
      });
      $.caricaDati();
    });
  };

  $.caricaDatiRegioni = function(){
    var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";
    $.getJSON(json_url, function(dati_grezzi) {
      $.datiRegioni = dati_grezzi.map(function(d){
        d.data_js = new Date(d.data);
        return d;
      });
      $.caricaDati();
    });
  };

  $.caricaDatiMondoConfermati = function(){
    var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
    $.get(csv_url, function(dati_grezzi) {
      $.parseDatiMondoGrezzi(dati_grezzi, 'confirmed');
      $.caricaDati();
    });
  };
  $.caricaDatiMondoMorti = function(){
    var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
    $.get(csv_url, function(dati_grezzi) {
      $.parseDatiMondoGrezzi(dati_grezzi, 'deaths');
      $.caricaDati();
    });
  }
  $.caricaDatiMondoRicoverati = function(){
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
      headers[j] = ('20' + anno + '.' + ("00" + mese).slice(-2) + '.' + ("00" + giorno).slice(-2));
    }
    
    for(var i=1; i<lines.length; i++){
      // ELIMINO GLI STATI US, as esempio "Lancaster, SC",US
      var currentline = lines[i].replace(/".*"/, '').split(",");
      var country = currentline[1];
      for(var j=4; j<headers.length; j++){
        if (!result[country + '--' + headers[j]]) result[country + '--' + headers[j]] = {
          data: headers[j],
          stato: country
        };
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
      if ($.viz_indici == 'confirmed' && !$.datiMondoConf) return $.caricaDatiMondoConfermati();
      if ($.viz_indici == 'deaths'    && !$.datiMondoConf) return $.caricaDatiMondoMorti();
      if ($.viz_indici == 'recovered' && !$.datiMondoConf) return $.caricaDatiMondoRicoverati();
      if ($.viz_indici == 'confirmed' && Object.values($.datiMondoConf)[0]['confirmed'] === undefined) return $.caricaDatiMondoConfermati();
      if ($.viz_indici == 'deaths'    && Object.values($.datiMondoConf)[0]['deaths'   ] === undefined) return $.caricaDatiMondoMorti();
      if ($.viz_indici == 'recovered' && Object.values($.datiMondoConf)[0]['recovered'] === undefined) return $.caricaDatiMondoRicoverati();
    }
    $.ridisegnaGrafico();
    // $.ridisegnaTabella();
  };
});