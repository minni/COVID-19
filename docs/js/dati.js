$(function(){
  $.caricaPopolazione = function(on_complete){
    var json_url = "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json";
    $.getJSON(json_url, function(dati_grezzi) {
      var mondo = 0;
      dati_grezzi.forEach(function(row){
        $.popolazione[row.country] = row.population / 1000000 * 10;
        mondo += $.popolazione[row.country];
      });
      if ($.popolazione.Italy) $.popolazione.italia = $.popolazione.Italy;
      if (mondo > 100) $.popolazione.mondo = mondo;
      $.popolazione.US = $.popolazione['United States'];
      $.popolazione.Russia = $.popolazione['Russian Federation'];

      $.popolazione['Cabo Verde'] = $.popolazione['Cape Verde'];
      $.popolazione['Congo (Brazzaville)'] = $.popolazione['Congo'];
      $.popolazione['Congo (Kinshasa)'] = $.popolazione['Congo'];
      $.popolazione["Cote d'Ivoire"] = $.popolazione['Ivory Coast'];
      // $.popolazione['Diamond Princess'] = $.popolazione[''];
      $.popolazione['Czechia'] = $.popolazione['Czech Republic'];
      // $.popolazione['Eswatini'] = $.popolazione[''];
      $.popolazione['Fiji'] = $.popolazione['Fiji Islands'];
      $.popolazione['Holy See'] = $.popolazione['Holy See (Vatican City State)'];
      // $.popolazione['Montenegro'] = $.popolazione[''];
      // $.popolazione['Serbia'] = $.popolazione[''];
      // $.popolazione['Sri Lanka'] = $.popolazione[''];
      // $.popolazione['Taiwan*'] = $.popolazione[''];
      // $.popolazione['Timor-Leste'] = $.popolazione[''];
      $.popolazione['Libya'] = $.popolazione['Libyan Arab Jamahiriya'];
      // $.popolazione['West Bank and Gaza'] = $.popolazione[''];
      // $.popolazione['Kosovo'] = $.popolazione[''];
      // $.popolazione['Burma'] = $.popolazione[''];
      // $.popolazione['MS Zaandam'] = $.popolazione[''];

      on_complete();
    });
  };

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
          d.data_js.getFullYear()
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
          d.data_js.getFullYear()
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
      
    var result  = Object.assign({}, $.datiMondoConf);
    var lines   = dati_grezzi.split("\n");
    var headers = lines[0].split(",");
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
        if (currentline[j]) result[country + '--' + headers[j]][chiave] += parseInt(currentline[j]);
      }
    }
    $.datiMondoConf = Object.assign({}, result);
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
      if (!$.datiMondoConf[0]) {
        $.datiMondoConf = Object.values($.datiMondoConf);
        $.datiMondoConf = $.datiMondoConf.filter(function(row){
          return row.stato ? true : false;
        });
      }
    }
    if ($('#regione a').length < 2 && ($.datiRegioni || $.datiProvince)) {
      $.regioni = ($.datiRegioni || $.datiProvince).reduce(function(tot, row){
        var cod = row.denominazione_regione + '--' + row.codice_regione;
        if (tot.includes(cod)) return tot;
        tot.push(cod);
        return tot;
      }, []).sort();
      $.regioni.forEach(function(row){
        [descr, cod] = row.split('--');
        if ($.viz_regione == cod) $('div#regione button').html(descr);
        $('#regione div.dropdown-menu').append(
          `<a class="dropdown-item" href="?area=italia&periodo=${$.viz_periodo}&indici=${$.viz_indici}&regione=${cod}">${descr}</a>`
        );
      });
    }
    $.ridisegnaGrafico();
    // $.ridisegnaTabella();
  };
});