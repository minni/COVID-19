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

  $.viz_area    = (query.area    || 'mondo'  );
  $.viz_regione = (query.regione || 'tutte'  );
  $.viz_periodo = (query.periodo || 'histabs');
  $.viz_indici  = (query.indici  || 'confirmed');
  
  $('div#area a').on('click', function(e){
    e.preventDefault();
    $.viz_area = $(this).attr('href').substring(1);
    $.ridisegnaMenu();
  });
  $('div#regione').on('click', 'a', function(e){
    console.log("click regione");
    e.preventDefault();
    $.viz_regione = $(this).attr('href').substring(1);
    $.ridisegnaMenu();
  });
  $('div#periodo a').on('click', function(e){
    e.preventDefault();
    $.viz_periodo = $(this).attr('href').substring(1);
    $.ridisegnaMenu();
  });
  $('div#indici a').on('click', function(e){
    e.preventDefault();
    $.viz_indici = $(this).attr('href').substring(1);
    $.ridisegnaMenu();
  });

  $.canvas = document.getElementById('canvas');
  $.ctx = $.canvas.getContext('2d');

  $.caricaPopolazione();

  $.ridisegnaMenu = function(){
    console.log(
      $.viz_area   ,
      $.viz_regione,
      $.viz_periodo,
      $.viz_indici 
    );
    $('div#area    button').html($('div#area    a[href="#' + $.viz_area    + '"').html());
    $('div#regione button').html($('div#regione a[href="#' + $.viz_regione + '"').html());
    $('div#periodo button').html($('div#periodo a[href="#' + $.viz_periodo + '"').html());
    $('div#indici  button').html($('div#indici  a[href="#' + $.viz_indici  + '"').html());
    $('div#area   ').show();
    $('div#regione').show();
    $('div#periodo').show();
    $('div#indici ').show();
    $('div#area    a').show();
    $('div#regione a').show();
    $('div#periodo a').show();
    $('div#indici  a').show();
    if ($.viz_area == 'mondo') {
      $('div#regione').hide();
      $('div#indici  a').hide();
      $('div#indici a[href="#tutti"]').show();
      $('div#indici a[href="#confirmed"]').show();
      $('div#indici a[href="#deaths"]').show();
      $('div#indici a[href="#recovered"]').show();
      if ($.viz_indici != 'tutti' &&
          $.viz_indici != 'confirmed' &&
          $.viz_indici != 'deaths' &&
          $.viz_indici != 'recovered') {
        $.viz_indici = 'tutti';
        return $.ridisegnaMenu();
      }
    }
    if ($.viz_area == 'italia') {
      $('div#indici a[href="#confirmed"]').hide();
      $('div#indici a[href="#deaths"]').hide();
      $('div#indici a[href="#recovered"]').hide();
      if ($.viz_indici == 'confirmed' ||
          $.viz_indici == 'deaths' ||
          $.viz_indici == 'recovered') {
        $.viz_indici = 'tutti';
        return $.ridisegnaMenu();
      }
    }
    $.caricaDati();
  };
  
  $.ridisegnaMenu();
});