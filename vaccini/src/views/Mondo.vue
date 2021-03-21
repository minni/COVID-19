<template>
  <div class="mondo">
    <loading :active.sync="isLoading" 
        :can-cancel="false" 
        zon-cancel="onCancel"
        :is-full-page="true"></loading>
    <ScelteMondo v-model="scelte" :paesi="paesi" :aree="aree" />
    <br />
    <Grafico :chart-data="datiGrafico" :options="options" />
  </div>
</template>

<script>
// @ is an alias to /src
import ScelteMondo from '@/components/ScelteMondo.vue'
import Grafico from '@/components/Grafico.js'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {dafaultChartOptions} from '@/lib/chartUtils';
import {filtraDati, dataDMY, manipulateData} from '@/lib/dataUtils';
import {caricaMondo} from '@/lib/loadUtils';

// https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-github-commits?from-embed=&file=/index.html:1562-1618
export default {
  name: 'Consegne',
  components: {
    Loading, ScelteMondo, Grafico
  },
  data: function () {
    return {
      isLoading: false,
      scelte: {
        periodo: 'last_180',
        manip: 'incremental',
        paese: 'all',
        prov: 'all'
      },
      paesi: ['Italia'],
      aree: {'Italia': [1,2,3]},
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
      if (el.scelte.paese == 'top_dec') return el.datiTop(dati, 'morti');
      if (el.scelte.paese == 'top_ter') return el.datiTop(dati, 'ricoveri');
      if (el.scelte.paese == 'top_cas') return el.datiTop(dati, 'casi');
      if (el.scelte.paese == 'all') return el.datiTutto(dati);
      dati = dati.filter(function(row){
        return row.country == el.scelte.paese ? true : false;
      });
      // if (el.scelte.prov) {
      //   dati = dati.filter(function(row){
      //     return row.area == el.scelte.prov ? true : false;
      //   });
      // }
      return el.datiTutto(dati);
    }
  },
  created: function() {
    if (!window.mondo) this.caricaMondo();
    this.caricaPaesi();
  },
  // watch: { },
  methods: {
    datiTutto: function(dati){
      var el = this;
      var labels = {
        casi: 'Casi',
        morti: 'Decessi',
        ricoveri: 'Terapie Intensive'
      };
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data);
        if (!acc[data]) acc[data] = {
          casi: 0,
          morti: 0,
          ricoveri: 0
        };
        acc[data].casi     += d.casi    ;
        acc[data].morti    += d.morti   ;
        acc[data].ricoveri += parseInt(d.ricoveri) || 0;
        return acc;
      }, {});
      return {
        labels: Object.keys(mappati),
        datasets: Object.keys(labels).map(function(v){
          return {
            label: labels[v],
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[v] ? d[v] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    datiTop: function(dati, campo){
      var el = this;
      var paesi = {};
      var max_campo = `max_${campo}`;
      dati.forEach(function(d){
        if (!paesi[d.country]) paesi[d.country] = {c: d.country, v: 0};
        if (paesi[d.country].v < d[max_campo]) paesi[d.country].v = d[max_campo];
      });
      paesi = Object.values(paesi).sort(function(a,b){
        if (a.v > b.v) return -1;
        if (a.v < b.v) return 1;
        return 0;
      });
      paesi = paesi.map(i=>i.c).slice(0, 15);
      
      dati = dati.filter((d)=>{
        if (paesi.indexOf(d.country) < 0) return false;
        return true;
      });

      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.country]) acc[data][d.country] = 0;
        acc[data][d.country] += d[campo];
        return acc;
      }, {});
      return {
        labels: Object.keys(mappati),
        datasets: paesi.map(function(p){
          return {
            label: p,
            fill: false,
            data: manipulateData(Object.values(mappati).map(function(d){
              return d[p] ? d[p] : 0;
            }), el.scelte.manip)
          };
        })
      };
    },
    // datiFornitore: function(dati){
    //   var el = this;
    //   var totale = 0;
    //   var fornitori = [];
    //   dati.forEach(function(d){
    //     if (fornitori.indexOf(d.fornitore) < 0) fornitori.push(d.fornitore);
    //   });
    //   var mappati = dati.reduce(function(acc, d){
    //     var data = dataDMY(d.data_consegna);
    //     if (!acc[data]) acc[data] = {};
    //     if (!acc[data][d.fornitore]) acc[data][d.fornitore] = 0;
    //     acc[data][d.fornitore] += d.numero_dosi;
    //     totale += d.numero_dosi;
    //     return acc;
    //   }, {});
    //   el.totale = totale;
    //   return {
    //     labels: Object.keys(mappati),
    //     datasets: fornitori.map(function(f){
    //       return {
    //         label: f,
    //         fill: false,
    //         data: manipulateData(Object.values(mappati).map(function(d){
    //           return d[f] ? d[f] : 0;
    //         }), el.scelte.manip)
    //       };
    //     })
    //   };
    // },
    datiPeriodo: function(periodo){
      if (!window.mondo) return [];
      var dati = window.mondo;
      var giorni = null;
    
      if (periodo == 'last_21') giorni = 22;
      if (periodo == 'last_180') giorni = 181;
      dati = filtraDati(dati, 'data', giorni);

      return dati;
    },
    caricaMondo: function(){
      var el = this;
      el.isLoading = true;
      var tmp = el.scelte.periodo;
      el.scelte.periodo = 'NONE';
      caricaMondo(function(){
        el.isLoading = false;
        el.scelte.periodo = tmp;
        el.caricaPaesi();
      });
    },
    caricaPaesi: function(){
      var el = this;
      el.paesi = [];
      el.aree = {};
      if (!window.mondo) return;
      window.mondo.forEach(function(d){
        if (!d.country) return;
        if (el.paesi.indexOf(d.country) < 0) el.paesi.push(d.country);
        if (!d.area) return;
        if (!el.aree[d.country]) el.aree[d.country] = [];
        if (el.aree[d.country].indexOf(d.area) < 0) {
          el.aree[d.country].push(d.area);
          el.aree[d.country] = el.aree[d.country].sort();
        }
      });
      el.paesi = el.paesi.sort();
    }
  }
}
</script>
