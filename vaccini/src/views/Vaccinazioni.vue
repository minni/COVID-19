<template>
  <div class="consegne">
    <loading :active.sync="isLoading" 
        :can-cancel="false" 
        zon-cancel="onCancel"
        :is-full-page="true"></loading>
    <ScelteVaccinazioni v-model="scelte" />
    TOTALE: {{totale | toNumber}}
    <Grafico :chart-data="datiGrafico" :options="options" />
  </div>
</template>

<script>
// @ is an alias to /src
import ScelteVaccinazioni from '@/components/ScelteVaccinazioni.vue'
import Grafico from '@/components/Grafico.js'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {dafaultChartOptions} from '@/lib/chartUtils';
import {filtraDati, dataDMY, manipulateData} from '@/lib/dataUtils';
import {caricaVaccinazioni} from '@/lib/loadUtils';

// https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-github-commits?from-embed=&file=/index.html:1562-1618
export default {
  name: 'Vaccinzazioni',
  components: {
    Loading, ScelteVaccinazioni, Grafico
  },
  data: function () {
    return {
      isLoading: false,
      scelte: {
        periodo: 'last_180',
        group_by: 'tot',
        manip: 'incremental',
        regione: 'all'
      },
      totale: 0,
      options: dafaultChartOptions,
    };
  },
  computed: {
    datiGrafico: function(){
      var el = this;
      var dati = el.datiPeriodo(el.scelte.periodo);
      if (el.scelte.regione != 'all') {
        dati = dati.filter((d)=>{
          return d.nome_area == el.scelte.regione
        });
      }
      if (el.scelte.group_by == 'reg') return el.datiRegione(dati);
      if (el.scelte.group_by == 'for') return el.datiFornitore(dati);
      if (el.scelte.group_by == 'ses') return el.datiSesso(dati);
      if (el.scelte.group_by == 'fas') return el.datiFascia(dati);
      if (el.scelte.group_by == 'dos') return el.datiDose(dati);
      if (el.scelte.group_by == 'cat') return el.datiCategoria(dati);
      return el.datiTutto(dati);
    }
  },
  created: function() {
    if (!window.vaccinazioni) this.caricaVaccinazioni();
  },
  // watch: { },
  methods: {
    datiTutto: function(dati){
      var el = this;
      var totale = 0;
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = 0;
        acc[data] += d.prima_dose;
        acc[data] += d.seconda_dose;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: [
          {
            label: 'Complessivo',
            // backgroundColor: '#f87979',
            fill: false,
            data: manipulateData(Object.values(mappati), el.scelte.manip)
          }
        ]
      };
    },
    datiRegione: function(dati){
      var el = this;
      var totale = 0;
      var regioni = [];
      dati.forEach(function(d){
        if (regioni.indexOf(d.nome_area) < 0) regioni.push(d.nome_area);
      });
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.nome_area]) acc[data][d.nome_area] = 0;
        acc[data][d.nome_area] += d.prima_dose;
        acc[data][d.nome_area] += d.seconda_dose;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: regioni.map(function(r){
          return {
            label: r,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[r] ? d[r] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiFornitore: function(dati){
      var el = this;
      var totale = 0;
      var fornitori = [];
      dati.forEach(function(d){
        if (fornitori.indexOf(d.fornitore) < 0) fornitori.push(d.fornitore);
      });
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.fornitore]) acc[data][d.fornitore] = 0;
        acc[data][d.fornitore] += d.prima_dose;
        acc[data][d.fornitore] += d.seconda_dose;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: fornitori.map(function(f){
          return {
            label: f,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[f] ? d[f] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiSesso: function(dati){
      var el = this;
      var totale = 0;
      var sessi = ['Maschile', 'Femminile'];
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {
          'Maschile': 0,
          'Femminile': 0
        };
        acc[data]['Maschile'] += d.sesso_maschile;
        acc[data]['Femminile'] += d.sesso_femminile;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: sessi.map(function(s){
          return {
            label: s,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[s] ? d[s] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiDose: function(dati){
      var el = this;
      var totale = 0;
      var dosi = ['Prima', 'Seconda'];
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {
          'Prima': 0,
          'Seconda': 0
        };
        acc[data]['Prima'] += d.prima_dose;
        acc[data]['Seconda'] += d.seconda_dose;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: dosi.map(function(ds){
          return {
            label: ds,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[ds] ? d[ds] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiFascia: function(dati){
      var el = this;
      var totale = 0;
      var fasce = [];
      dati.forEach(function(d){
        if (fasce.indexOf(d.fascia_anagrafica) < 0) fasce.push(d.fascia_anagrafica);
      });
      fasce = fasce.sort();
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.fascia_anagrafica]) acc[data][d.fascia_anagrafica] = 0;
        acc[data][d.fascia_anagrafica] += d.prima_dose;
        acc[data][d.fascia_anagrafica] += d.seconda_dose;
        totale += d.prima_dose + d.seconda_dose;
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: fasce.map(function(f){
          return {
            label: f,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[f] ? d[f] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiCategoria: function(dati){
      var el = this;
      var totale = 0;
      var categorie = [];
      dati.forEach(function(d){
        Object.keys(d).filter(function(i){
          return i.match(/^categoria_/);
        }).forEach(function(c){
          if (categorie.indexOf(c) < 0) categorie.push(c);
        });
      });
      // categorie = categorie.sort();
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_somministrazione);
        if (!acc[data]) acc[data] = {};
        categorie.forEach(function(c){
          if (!acc[data][c]) acc[data][c] = 0;
          acc[data][c] += d[c];
          totale += d[c];
        });
        return acc;
      }, {});
      el.totale = totale;
      return {
        labels: Object.keys(mappati),
        datasets: categorie.map(function(c){
          var label = c.replace(/^categoria_/, '').split('_').join(' ');
          label = label.charAt(0).toUpperCase() + label.slice(1);
          return {
            label: label,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[c] ? d[c] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiPeriodo: function(periodo){
      if (!window.vaccinazioni) return [];
      var dati = window.vaccinazioni.data;
      var giorni = null;

      if (periodo == 'last_21') giorni = 22;
      if (periodo == 'last_180') giorni = 181;
      return filtraDati(dati, 'data_somministrazione', giorni);
    },
    caricaVaccinazioni: function(){
      var el = this;
      el.isLoading = true;
      var tmp = el.scelte.group_by;
      el.scelte.group_by = 'NONE';
      caricaVaccinazioni(function(){
        el.isLoading = false;
        el.scelte.group_by = tmp;
      });
    }
  }
}
</script>
