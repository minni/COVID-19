$(function(){
  $.ridisegnaGrafico = function(){
    if ($.viz_area == 'italia') {
      var dati = $.filtraDati($.variabili.it_vars),
          labels = $.labelsDati(),
          variabili = $.variabili.it_vars;
      if ($.viz_periodo == 'histabs') return $.lineGraph(dati, labels, variabili, 'abs');
      if ($.viz_periodo == 'histinc') return $.lineGraph(dati, labels, variabili, 'inc');
      if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'italia');
    }
    if ($.viz_area == 'mondo') {
      var dati = $.filtraDati($.variabili.wl_vars),
          labels = $.labelsDati(),
          variabili = $.variabili.wl_vars;
      if ($.viz_periodo == 'histabs') return $.lineGraph(dati, labels, variabili, 'abs');
      if ($.viz_periodo == 'histinc') return $.lineGraph(dati, labels, variabili, 'inc');
      if ($.viz_periodo == 'histprc') return $.lineGraph(dati, labels, variabili, 'mondo');
    }
    return alert("Grafico NON definito");
  };

  $.filtraDati = function(variabili){
    var keys = Object.keys(variabili);
    var dati = 'datiRegioni';
    if ($.viz_area == 'italia' && $.viz_indici == 'province') dati = 'datiProvince';
    if ($.viz_area == 'mondo') dati = 'datiMondoConf';
    return $[dati].reduce(function(tot, row, idx){
      keys.forEach(function(k){
        if (!tot[k]) tot[k] = {};
        if (!tot[k][row.data_ymd]) tot[k][row.data_ymd] = 0;
        if (row[k]) tot[k][row.data_ymd] += row[k];
      });
      return tot;
    }, {});
  };

  $.labelsDati = function(){
    var dati = 'datiRegioni';
    if ($.viz_area == 'italia' && $.viz_indici == 'province') dati = 'datiProvince';
    if ($.viz_area == 'mondo') dati = 'datiMondoConf';
    return $[dati].reduce(function(tot, row){
      if (tot.includes(row.data_h)) return tot;
      tot.push(row.data_h);
      return tot;
    }, []);
  };

  $.calcolaValore = function(value, prev, key, type){
    if (type == 'abs') return value;
    if (type == 'inc' && prev == 'ND') return 0;
    if (type == 'inc') return (value - prev);
    if ($.popolazione[type]) return (Math.round(value / $.popolazione[type] * 1000) / 1000);
    if ($.popolazione[key]) return (Math.round(value / $.popolazione[key] * 1000) / 1000);
    console.log("Manca POP", key);
    return value;
  };

  $.lineGraph = function(dati, labels, variabili, filtro){
    var options = Object.assign({}, $.base_hist_options);
    var keys = Object.keys(variabili);

    options.data.labels = labels;
    if (filtro == 'abs') options.options.scales.yAxes[0].scaleLabel.labelString = 'Persone';
    else if (filtro == 'inc') options.options.scales.yAxes[0].scaleLabel.labelString = 'Incremento';
    else options.options.scales.yAxes[0].scaleLabel.labelString = 'Perc. su 100.000';

    window.dati = dati;
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
    console.log("Graph", dati, labels, variabili, filtro, options);
    window.options = options;
    $.covidGraph = new Chart($.ctx, options);
  };
});