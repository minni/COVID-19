<template>
  <div class="consegne">
    <loading :active.sync="isLoading" 
        :can-cancel="false" 
        zon-cancel="onCancel"
        :is-full-page="true"></loading>
    <ScelteConsegne v-model="scelte" />
    TOTALE: {{totale | toNumber}}
    <Grafico :chart-data="datiGrafico" :options="options" />
  </div>
</template>

<script>
// @ is an alias to /src
import ScelteConsegne from '@/components/ScelteConsegne.vue'
import Grafico from '@/components/Grafico.js'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {dafaultChartOptions} from '@/lib/chartUtils';
import {filtraDati, dataDMY, manipulateData} from '@/lib/dataUtils';
import {caricaConsegne} from '@/lib/loadUtils';

// https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-github-commits?from-embed=&file=/index.html:1562-1618
export default {
  name: 'Consegne',
  components: {
    Loading, ScelteConsegne, Grafico
  },
  data: function () {
    return {
      isLoading: false,
      scelte: {
        periodo: 'last_180',
        group_by: 'tot',
        manip: '',
      },
      totale: 0,
      options: dafaultChartOptions,
    };
  },
  computed: {
    datiGrafico: function(){
      var dati = this.datiPeriodo(this.scelte.periodo);
      if (this.scelte.group_by == 'reg') return this.datiRegione(dati);
      if (this.scelte.group_by == 'for') return this.datiFornitore(dati);
      return this.datiTutto(dati);
    }
  },
  created: function() {
    if (!window.consegne) this.caricaConsegne();
  },
  // watch: { },
  methods: {
    datiTutto: function(dati){
      var el = this;
      var totale = 0;
      var mappati = dati.reduce(function(acc, d){
        var data = dataDMY(d.data_consegna);
        if (!acc[data]) acc[data] = 0;
        acc[data] += d.numero_dosi;
        totale += d.numero_dosi;
        return acc;
      }, {});
      window.consegnex = mappati;
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
        var data = dataDMY(d.data_consegna);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.nome_area]) acc[data][d.nome_area] = 0;
        acc[data][d.nome_area] += d.numero_dosi;
        totale += d.numero_dosi;
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
        var data = dataDMY(d.data_consegna);
        if (!acc[data]) acc[data] = {};
        if (!acc[data][d.fornitore]) acc[data][d.fornitore] = 0;
        acc[data][d.fornitore] += d.numero_dosi;
        totale += d.numero_dosi;
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
    datiPeriodo: function(periodo){
      if (!window.consegne) return [];
      var dati = window.consegne.data;
      var giorni = null;

      if (periodo == 'last_21') giorni = 22;
      if (periodo == 'last_180') giorni = 181;
      return filtraDati(dati, 'data_consegna', giorni);
    },
    caricaConsegne: function(){
      var el = this;
      el.isLoading = true;
      var tmp = el.scelte.group_by;
      el.scelte.group_by = 'NONE';
      caricaConsegne(function(){
        el.isLoading = false;
        el.scelte.group_by = tmp;
      });
    }
  }
}
</script>
