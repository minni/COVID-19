import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

var numFmt = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

var dafaultChartOptions = {
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
    itemSort: function(a, b) {
      // console.log(a, b);
      if (parseInt(a.value) > parseInt(b.value)) return -1;
      if (parseInt(a.value) < parseInt(b.value)) return 1;
      return 0;
    },
    callbacks: {
      label: function(tooltipItem, data) {
        var legenda = data.datasets[tooltipItem.datasetIndex].label;
        // console.log(tooltipItem, data, legenda);
        return ` ${numFmt.format(tooltipItem.yLabel / 1000)}k ${legenda}`;
      },
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
};

export {numFmt, dafaultChartOptions};

