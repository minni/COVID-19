// https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

window.pop_stati = {
  Austria:          (   8.822 * 1000000 / 100000),
  China:            (1386     * 1000000 / 100000),
  France:           (  66.89  * 1000000 / 100000),
  Germany:          (  82.79  * 1000000 / 100000),
  Iran:             (  81.16  * 1000000 / 100000),
  Italy:            (  60.48  * 1000000 / 100000),
  Spain:            (  46.66  * 1000000 / 100000),
  US:               ( 327.2   * 1000000 / 100000),
  'United Kingdom': (  66.44  * 1000000 / 100000),
  Switzerland:      (   8.57  * 1000000 / 100000),
  Ireland:          (   4.83  * 1000000 / 100000),
  // 'Vietnam':        (  95.54  * 1000000 / 100000),
};

function loadMondo(ctx, options, tipo, perc){
  var csv_url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-"+tipo+".csv";
  $('#status').html('Importo dati Mondialo CSV da <pre>'+csv_url+'</pre>');
  $('#headerJumbo p.italy').attr('style', 'display: none!important');
  $('#headerJumbo p.mondo').show();
  $('#headerJumbo div h3').html("Dati mondiali: " + tipo);
  options.options.title.text = "COVID Mondiale " + tipo;
  // // PLUGIN per colorare
  $.getScript("https://github.com/nagix/chartjs-plugin-colorschemes/releases/download/v0.4.0/chartjs-plugin-colorschemes.min.js", function(){
    $.get(csv_url, function(dati_grezzi) {
      // console.log("Dati", dati_grezzi);
      window.dati_grezzi = dati_grezzi;

      // https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
      var lines   = dati_grezzi.split("\n");
      var result  = {};
      var headers = lines[0].split(",");
      var date    = [];
      for(var j=4; j<headers.length; j++){
        var data = headers[j];
        var giorno, mese, anno;
        [mese, giorno, anno] = data.split('/');
        date.push(giorno + '.' + mese + '.20' + anno);
      }
    
      for(var i=1; i<lines.length; i++){
        // ELIMINO GLI STATI US, as esempio "Lancaster, SC",US
        var currentline = lines[i].replace(/".*"/, '').split(",");
        var country = currentline[1];
        if (!result[country]) result[country] = [];
        for(var j=4; j<headers.length; j++){
          if (!result[country][j-4]) result[country][j-4] = 0;
          result[country][j-4] += parseInt(currentline[j]);
        }
      }

      // IMPOSTO ETICHETTE
      $('#status').html('Carico etichette dei giorni');
      options.data.labels = date;
      window.options = options;
      // options.options.legend.display = false;
      options.options.legend.position = 'bottom';
      
      // var stati = "Afghanistan|Albania|Algeria|Andorra|Argentina|Armenia|Australia|Austria|Azerbaijan|Bahrain|Bangladesh|Belarus|Belgium|Bhutan|Bolivia|Bosnia and Herzegovina|Brazil|Brunei|Bulgaria|Burkina Faso|Cambodia|Cameroon|Canada|Chile|China|Colombia|Congo (Kinshasa)|Costa Rica|Cote d'Ivoire|Croatia|Cruise Ship|Cuba|Cyprus|Czechia|Denmark|Dominican Republic|Ecuador|Egypt|Estonia|Finland|France|French Guiana|Georgia|Germany|Greece|Guyana|Holy See|Honduras|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kuwait|Latvia|Lebanon|Liechtenstein|Lithuania|Luxembourg|Malaysia|Maldives|Malta|Martinique|Mexico|Moldova|Monaco|Mongolia|Morocco|Nepal|Netherlands|New Zealand|Nigeria|North Macedonia|Norway|Oman|Pakistan|Panama|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Reunion|Romania|Russia|San Marino|Saudi Arabia|Senegal|Serbia|Singapore|Slovakia|Slovenia|South Africa|Spain|Sri Lanka|Sweden|Switzerland|Taiwan*|Thailand|Togo|Tunisia|Turkey|US|Ukraine|United Arab Emirates|United Kingdom|Vietnam".split('|');
      var stati = "Austria|China|France|Germany|Iran|Ireland|Italy|Spain|Switzerland|US|United Kingdom".split('|');
      // IMPOSTO DATASET
      // if (perc) options.options.scales.yAxes[0].scaleLabel.labelString = 'Perc. su 100.000';
      for (var [key, value] of Object.entries(result)) {
        // if (value[value.length - 1] > 50) {
        if (stati.includes(key)) {
          // console.log(`${key}: ${value}`);
          var prev = 'ND';
          options.data.datasets.push({
            // backgroundColor: Object.values(window.chartColors)[idx],
            // borderColor: Object.values(window.chartColors)[idx],
            fill: false,
            label: key,
            // data: value
            data: value.map(function(i){
              if (!i) i = 0;
              if (perc == 'SI') return (Math.round(i / window.pop_stati[key] * 10000) / 10000);
              if (perc == 'TREND') {
                if (prev == 'ND') prev = i;
                var res = (prev == 0 ? 0 : ((i - prev) / prev));
                prev = i;
                if (res > 1) return 100;
                if (res < -1) return -100;
                return (Math.round(res * 10000) / 100);
              }
              return i;
            })
          });
        }
      }
      window.result = result;
      
      $('#status').html('Genero il grafico');
      window.covidLine = new Chart(ctx, options);
      $('#status').hide();
    });
  });
}