<template>
  <div class="grafico">
    GRAFICO {{dati.periodo}}
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'Grafico',
  props: {
    dati: Object
  }
}
</script>
