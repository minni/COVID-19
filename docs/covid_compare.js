function loadConfronto(ctx, options, tipo){
  var json_url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json";

  $.getScript("https://github.com/nagix/chartjs-plugin-colorschemes/releases/download/v0.4.0/chartjs-plugin-colorschemes.min.js", function(){
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
      
      var regioni = dati_grezzi.reduce(function(tot, i){
        tot[i.codice_regione] = i.denominazione_regione;
        return tot;
      }, {});

      $('a[href^="?confronta="]').on('click', function(e){
        event.preventDefault();
        var el = $(this);
        var tipo = el.attr('href').replace('?confronta=', '');
        var descr = el.html();
        window.history.pushState({},"", el.attr('href'));
        $('#headerJumbo div h3').html("Confronto regioni: " + descr);
        options.options.title.text = "Confronto regioni: " + descr;
        $('.dropdown-menu.show').removeClass('show');

        options.data.datasets = [];
        for (var [key, value] of Object.entries(regioni)) {
          options.data.datasets.push({
            fill: false,
            label: value,
            data: date.map(function(i){
              var dato = dati_grezzi.find(function(el){
                return el.data == i && el.codice_regione == key;
              });
              if (dato == undefined) return dato;
              if (!dato[tipo]) return 0;
              var value = dato[tipo] / window.popolazione[dato.codice_regione];
              return (Math.round(value * 10000) / 10000);
            })
          });
        }
        window.covidLine = new Chart(ctx, options);
        return false;
      });
      $('a[href="?confronta='+tipo+'"]').click();
      window.onpopstate = function(event) {
        if(event && event.state) {
          // event.state.foo
        }
      }
    });
  });
}