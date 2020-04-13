$(function(){
  // https://html-online.com/articles/get-url-parameters-javascript/
  var getUrlVars = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

  // PER DEBUG
  // $.ppp = function(){
  //   return $.datiMondoConf.filter(function(row){
  //     if (row.stato == 'Denmark') return true;
  //     return false;
  //   }).slice(-1)[0].confirmed;
  // };

  var query = getUrlVars();
  $.viz_area    = (query.area    || 'italia' );
  $.viz_regione = (query.regione || 'tutte'  );
  $.viz_periodo = (query.periodo || 'histabs');
  $.viz_indici  = (query.indici  || 'tutti'  );

  $.canvas = document.getElementById('canvas');
  $.ctx = $.canvas.getContext('2d');

  $.ridisegnaMenu = function(){
    if ($.viz_area != 'mondo' && $.viz_area != 'italia' && $.viz_area != 'italia_nol') $.viz_area = 'italia';
    if ($.viz_area == 'mondo') {
      if ($.viz_indici != 'tutti' &&
          $.viz_indici != 'confirmed' &&
          $.viz_indici != 'deaths' &&
          $.viz_indici != 'recovered') {
        $.viz_indici = 'tutti';
      }
    } else if ($.viz_area == 'italia' || $.viz_area == 'italia_nol') {
      if ($.viz_indici == 'confirmed' ||
          $.viz_indici == 'deaths' ||
          $.viz_indici == 'recovered') {
        $.viz_indici = 'tutti';
      }
      if ($.viz_regione == 'tutte' && $.viz_indici == 'province') {
        $.viz_indici = 'tutti';
      }
      if ($.viz_regione != 'tutte' && ($.viz_indici != 'tutti' && $.viz_indici != 'province')) {
        $.viz_indici = 'tutti';
      }
      if ($.viz_indici == 'province' && $.viz_periodo == 'histprc') $.viz_periodo = 'histabs';
    }

    console.log(
      $.viz_area   ,
      $.viz_regione,
      $.viz_periodo,
      $.viz_indici 
    );
    $('div#area    button').html($(`div#area    a[href*="area=${$.viz_area}"]`).html());
    $('div#regione button').html($(`div#regione a[href*="regione=${$.viz_regione}"]`).html());
    $('div#periodo button').html($(`div#periodo a[href*="periodo=${$.viz_periodo}"]`).html());
    $('div#indici  button').html($(`div#indici  a[href*="indici=${$.viz_indici}"]`).html());
    
    if ($.viz_area == 'mondo') {
      $('div#regione').hide();
      $('div#indici a').hide();
      $('div#indici a[href*="indici=tutti"]').show();
      $('div#indici a[href*="indici=confirmed"]').show();
      $('div#indici a[href*="indici=deaths"]').show();
      $('div#indici a[href*="indici=recovered"]').show();
    }
    if ($.viz_area == 'italia' || $.viz_area == 'italia_nol') {
      $('div#indici a[href*="indici=confirmed"]').hide();
      $('div#indici a[href*="indici=deaths"]').hide();
      $('div#indici a[href*="indici=recovered"]').hide();
      if ($.viz_regione == 'tutte') {
        $('div#indici a[href*="indici=province"]').hide();
      } else {
        $('div#indici a').hide();
        $('div#indici a[href*="indici=tutti"]').show();
        $('div#indici a[href*="indici=province"]').show();
      }
      if ($.viz_indici == 'province') $('div#periodo a[href*="periodo=histprc"]').hide();
    }

    $('div#area a').each(function() {
      $(this).attr("href", $(this).attr("href") + `&regione=${$.viz_regione}&periodo=${$.viz_periodo}&indici=${$.viz_indici}`);
    });
    $('div#regione a').each(function() {
      $(this).attr("href", $(this).attr("href") + `&area=${$.viz_area}&periodo=${$.viz_periodo}&indici=${$.viz_indici}`);
    });
    $('div#periodo a').each(function() {
      $(this).attr("href", $(this).attr("href") + `&area=${$.viz_area}&regione=${$.viz_regione}&indici=${$.viz_indici}`);
    });
    $('div#indici a').each(function() {
      $(this).attr("href", $(this).attr("href") + `&area=${$.viz_area}&regione=${$.viz_regione}&periodo=${$.viz_periodo}`);
    });

    $.caricaDati();
  };

  // caricaPopolazione
  //   quindi -> ridisegnaMenu
  //     quindi -> caricaDati
  //       quindi -> ridisegnaGrafico
  //         quindi -> $.lineGraph
  $.caricaPopolazione(function(){
    $.ridisegnaMenu();
  });
});