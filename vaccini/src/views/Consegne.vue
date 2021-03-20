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
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';


var numFmt = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
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
        incr: true,
      },
      totale: 0,
      options: {
        plugins: {
          colorschemes: {
            scheme: Aspect6,
            override: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        title: { display: false },
        tooltips: {
          mode: 'index',
          intersect: true,
          callbacks: {
            label: function(tooltipItem) {
              // console.log(tooltipItem);
              return ' ' + numFmt.format(tooltipItem.yLabel / 1000) +'k';
            }
          }
        },
        // hover: { mode: 'nearest', intersect: true },
        legend: { position: 'bottom' },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: { display: true, labelString: 'Giorni' }
          }],
          yAxes: [{
            display: true,
            ticks: {
              callback: function(label) {
                return numFmt.format(label / 1000) +'k';
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Persone'
            }
          }]
        }
      },
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
        var data = el.remapData(d.data_consegna);
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
            data: el.dataGraphIncr(Object.values(mappati))
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
        var data = el.remapData(d.data_consegna);
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
            data: el.dataGraphIncr(
              Object.values(mappati).map(function(d){
                return d[r] ? d[r] : 0;
              })
            )
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
        var data = el.remapData(d.data_consegna);
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
            data: el.dataGraphIncr(
              Object.values(mappati).map(function(d){
                return d[f] ? d[f] : 0;
              })
            )
          };
        })
      };
    },
    datiPeriodo: function(periodo){
      if (!window.consegne) return [];
      var dati = window.consegne.data;
      var limite = '2000-00-00T00:00:00';
      if (periodo == 'last_21') {
        limite = new Date();
        limite.setDate(limite.getDate() - 22);
        limite = limite.toJSON().split('T')[0] + '00:00:00';
      }
      if (periodo == 'last_180') {
        limite = new Date();
        limite.setDate(limite.getDate() - 181);
        limite = limite.toJSON().split('T')[0] + '00:00:00';
      }
      dati = dati.filter(function(row){
        return row.data_consegna >= limite ? true : false;
      }).sort(function(a,b){
        if (a.data_consegna < b.data_consegna) return -1;
        if (a.data_consegna > b.data_consegna) return 1;
        return 0;
      });
      return dati;
    },
    remapData: function(d){
      var giorno, mese, anno;
      [anno, mese, ...giorno] = d.split('-');
      giorno = giorno[0].split('T')[0];
      return (giorno + '.' + mese + '.' + anno);
    },
    dataGraphIncr: function(data){
      if (this.scelte.incr) {
        var acc = 0;
        return data.map(function(row){
          var res = row + acc;
          acc += row;
          return res;
        });
      }
      return data;
    },
    caricaConsegne: function(){
      var el = this;
      el.isLoading = true;
      var tmp = el.scelte.group_by;
      el.scelte.group_by = 'NONE';
      fetch("https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/consegne-vaccini-latest.json")
        .then(response => response.json())
        .then(data => {
          window.consegne = data;
          el.isLoading = false;
          el.scelte.group_by = tmp;
        });
    }
  }
}
</script>
