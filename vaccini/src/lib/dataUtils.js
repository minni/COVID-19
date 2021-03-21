var filtraDati = function(dati, campo, giorni = null){
  if (!dati) return [];
  var limite = '2000-00-00T00:00:00';
  if (giorni) {
    limite = new Date();
    limite.setDate(limite.getDate() - giorni);
    limite = limite.toJSON().split('T')[0] + '00:00:00';
  }
  dati = dati.filter(function(row){
    return row[campo] >= limite ? true : false;
  }).sort(function(a,b){
    if (a[campo] < b[campo]) return -1;
    if (a[campo] > b[campo]) return 1;
    return 0;
  });
  return dati;
};

var dataDMY = function(data){
  var giorno, mese, anno;
  [anno, mese, ...giorno] = data.split('-');
  giorno = giorno[0].split('T')[0];
  return (giorno + '.' + mese + '.' + anno);
};

var manipulateData = function(data, manipulation = false){
  if (manipulation == 'incremental') {
    var acc = 0;
    return data.map(function(row){
      var res = row + acc;
      acc += row;
      return res;
    });
  }
  return data;
};

export {
  filtraDati, dataDMY, manipulateData
};