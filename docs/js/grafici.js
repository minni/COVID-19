$(function(){
  $.ridisegnaGrafico = function(){
    if ($.viz_area == 'italia') {
      var dati = $.datiRegioni.slice(),
          labels = $.labelsDati(),
          variabili = Object.assign({}, $.variabili.it_vars);
      if ($.viz_regione != 'tutte') {
        dati = dati.filter(function(row){
          return $.viz_regione == row.codice_regione ? true : false;
        });
      }
      dati = $.filtraDati($.variabili.it_vars, dati);
      if ($.viz_periodo == 'histabs') return $.lineGraph(dati, labels, variabili, 'abs');
      if ($.viz_periodo == 'histinc') return $.lineGraph(dati, labels, variabili, 'inc');
      if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'italia');
    }
    if ($.viz_area == 'mondo') {
      var dati = $.datiMondoConf.slice(),
          labels = $.labelsDati(),
          variabili = Object.assign({}, $.variabili.wl_vars);
      if ($.viz_indici == 'confirmed' ||
          $.viz_indici == 'deaths'    ||
          $.viz_indici == 'recovered') {
        var chiave = $.viz_indici + '';
        // RIMUOVO DATI inutilizzabili
        dati = dati.filter(function(row){
          if (!$.popolazione[row.stato]) console.log("MANCA!!! $.popolazione[row.stato]", row.stato);
          if (!$.popolazione[row.stato]) return false;
          if ($.popolazione[row.stato] < 10) return false;
          // if (!row[chiave]) return false;
          return true;
        });
        var ultimo_giorno = dati.reduce(function(tot, row){
          if (!row[chiave]) return tot;
          if (row.data_ymd > tot) tot = row.data_ymd;
          return tot;
        }, '2000-01-01');
        // if ($.ppp() != 2366) debugger;
        var dati_ultimo_giorno = dati.slice().filter(function(row){
          return row.data_ymd == ultimo_giorno;
        });
        // if ($.ppp() != 2366) debugger;
        if ($.viz_periodo == 'histprc') {
          dati_ultimo_giorno = dati_ultimo_giorno.map(function(i){
            // SE SCRICO i[chiave] / ($.popolazione[i.stato] * 100000); MI SBALLA L?ARRAY...
            i.tot = i[chiave] / ($.popolazione[i.stato] * 100000);
            return i;
          });
        }
        // if ($.ppp() != 2366) debugger;
        dati_ultimo_giorno.sort(function(a,b){
          if (a.tot > b.tot) return -1;
          if (a.tot < b.tot) return 1;
          if (a[chiave] > b[chiave]) return -1;
          if (a[chiave] < b[chiave]) return 1;
          return 0;
        });
        // if ($.ppp() != 2366) debugger;
        var primi_15 = dati_ultimo_giorno.map(function(row){ return row.stato; }).slice(0, 15);

        dati = dati.filter(function(row){
          return primi_15.includes(row.stato) ? true : false;
        }).map(function(row){
          row[row.stato] = row[chiave];
          return row;
        });

        variabili = primi_15.reduce(function(tot, row){
          tot[row] = row;
          return tot;
        }, {});

        // var ultima = dati.map(function(row){ return row.data_ymd; });
        // ultima.sort();
        // ultima = ultima.slice(-1)[0];
        // var ultimi = dati.filter(function(row){
        //   return row.data_ymd == ultima ? true : false;
        // });
        // if ($.viz_periodo == 'histprc') {
        //   ultimi.map(function(row){
        //     if (!row[chiave]) row[chiave] = 0;
        //     row[chiave] = row[chiave] / ($.popolazione[row.stato] * 100000);
        //     return row;
        //   });
        // }
        // ultimi.sort(function(a,b){
        //   if (a[chiave] > b[chiave]) return -1;
        //   if (a[chiave] < b[chiave]) return 1;
        //   return 0;
        // });
        // window.u = ultimi.slice();
        // ultimi = ultimi.map(function(row){ return row.stato; }).slice(0, 25);
        // dati = $.datiMondoConf.slice().filter(function(row){
        //   // if (!row[chiave]) return false;
        //   // if (parseInt(row[chiave]) < 1) return false;
        //   // if (!$.popolazione[row.stato]) return false;
        //   // if ($.popolazione[row.stato] < 10) return false;
        //   if (row.data_ymd > ultima) return false;
        //   return ultimi.includes(row.stato) ? true : false;
        // }).map(function(row){
        //   row[row.stato] = row[chiave];
        //   return row;
        // });
        // variabili = ultimi.reduce(function(tot, row){
        //   tot[row] = row;
        //   return tot;
        // }, {});
        // if (chiave == 'confirmed') variabili = {confirmed: 'CONF'};
        // if (chiave == 'deaths'   ) variabili = {deaths:    'MORT'};
        // if (chiave == 'recovered') variabili = {recovered: 'RECV'};
        dati = $.filtraDati(variabili, dati);
        if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'stato');
      } else {
        dati = $.filtraDati(variabili, dati);
        if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'mondo');
      }
      
      if ($.viz_periodo == 'histabs') return $.lineGraph(dati, labels, variabili, 'abs');
      if ($.viz_periodo == 'histinc') return $.lineGraph(dati, labels, variabili, 'inc');
      // if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'prc');
    }
    return alert("Grafico NON definito");
  };

  $.filtraDati = function(variabili, dati){
    var keys = Object.keys(variabili);
    return dati.reduce(function(tot, row, idx){
      keys.forEach(function(k){
        if (!tot[k]) tot[k] = {};
        if (!tot[k][row.data_ymd]) tot[k][row.data_ymd] = 0;
        if (row[k]) tot[k][row.data_ymd] += row[k];
      });
      return tot;
    }, {});
  };

  $.labelsDati = function(dati = false){
    if (!dati) {
      dati = 'datiRegioni';
      if ($.viz_area == 'italia' && $.viz_indici == 'province') dati = 'datiProvince';
      if ($.viz_area == 'mondo') dati = 'datiMondoConf';
      dati = $[dati].slice();
    }
    return dati.reduce(function(tot, row){
      if (tot.includes(row.data_h)) return tot;
      tot.push(row.data_h);
      return tot;
    }, []);
  };

  $.calcolaValore = function(value, prev, key, type){
    if (type == 'abs') return value;
    if (type == 'inc' && prev == 'ND') return 0;
    if (type == 'inc') return (value - prev);
    if (type == 'stato') {
      console.log("SS", value, key, type, prev);
      return value;
    }
    console.log("PPPPPPPPP");
    // if (key == 'confirmed') return value;
    // if (key == 'deaths'   ) return value;
    // if (key == 'recovered') return value;
    if ($.popolazione[type]) return (Math.round(value / $.popolazione[type] * 1000) / 1000);
    if ($.popolazione[key]) return (Math.round(value / $.popolazione[key] * 1000) / 1000);
    console.log("Manca POP", key);
    return value;
  };

  $.lineGraph = function(dati, labels, variabili, filtro){
    console.log("oo", $.base_hist_options);
    var options = Object.assign({}, $.base_hist_options);
    var keys = Object.keys(variabili);

    options.data.labels = labels;
    if (filtro == 'abs') options.options.scales.yAxes[0].scaleLabel.labelString = 'Persone';
    else if (filtro == 'inc') options.options.scales.yAxes[0].scaleLabel.labelString = 'Incremento';
    else options.options.scales.yAxes[0].scaleLabel.labelString = 'Perc. su 100.000';
    if (filtro == 'inc') {
      // options.type = 'bar';
      variabili = Object.assign({}, variabili);
      delete(variabili.nuovi_attualmente_positivi);
      delete(dati.nuovi_attualmente_positivi);
      keys = Object.keys(variabili);
    }

    options.data.datasets = [];
    for (var [key, value] of Object.entries(dati)) {
      var prev = 'ND';
      options.data.datasets.push({
        // backgroundColor: colori[key],
        // borderColor:     colori[key],
        fill: false,
        label: variabili[key],
        data: Object.values(value).map(function(i){
          var res = $.calcolaValore(i, prev, key, filtro);
          prev = i;
          return res;
        })
      });
    }
    // NASCONDO I TAMPONI
    if (variabili.tamponi) options.data.datasets[options.data.datasets.length - 1].hidden = true;
    
    // console.log("Graph", dati, labels, variabili, filtro, options);
    // window.options = options;
    if ($.covidGraph) {
      $.ctx.clearRect(0, 0, $.canvas.width, $.canvas.height);
      // $.covidGraph.options = options;
      // $.covidGraph.update();
      delete($.covidGraph);
      $.covidGraph = new Chart($.ctx, options);
    } else {
      $.covidGraph = new Chart($.ctx, options);
    }
  };
});