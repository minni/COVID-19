<template>
  <div class="scelte_vaccinazioni">
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
      <option value="ses">Sesso</option>
      <option value="fas">Fascia Anagrafica</option>
      <option value="cat">Categorie</option>
      <option value="dos">Prima / Seconda dose</option>
    </select>

    <br />

    Regione {{value.regione}}
    <select v-model="value.regione">
      <option value="all">Tutte</option>
      <option>Abruzzo</option>
      <option>Basilicata</option>
      <option>Calabria</option>
      <option>Campania</option>
      <option>Emilia-Romagna</option>
      <option>Friuli-Venezia Giulia</option>
      <option>Lazio</option>
      <option>Liguria</option>
      <option>Lombardia</option>
      <option>Marche</option>
      <option>Molise</option>
      <option>Provincia Autonoma Bolzano / Bozen</option>
      <option>Provincia Autonoma Trento</option>
      <option>Piemonte</option>
      <option>Puglia</option>
      <option>Sardegna</option>
      <option>Sicilia</option>
      <option>Toscana</option>
      <option>Umbria</option>
      <option>Valle d'Aosta / Vallée d'Aoste</option>
      <option>Veneto</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'ScelteVaccinazioni',
  props: ['value']
}
</script>
