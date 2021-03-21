<template>
  <div class="scelte_consegne">
    SCELTE:
    Periodo
    <select v-model="value.periodo">
      <option value="last_21">Ultimi 21 giorni</option>
      <option value="last_180">Ultimi 6 mesi</option>
      <option value="all">Tutto</option>
    </select>

    <br />

    Grafico {{value.manip}}
    <select v-model="value.manip">
      <option value="">Giorno per giorno</option>
      <option value="incremental">Incrementale</option>
    </select>

    <br />

    Andamento {{value.group_by}}
    <select v-model="value.group_by">
      <option value="tot">Totale</option>
      <option value="reg">Regione</option>
      <option value="for">Fornitore</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Grafico',
  props: ['value']
}
</script>
