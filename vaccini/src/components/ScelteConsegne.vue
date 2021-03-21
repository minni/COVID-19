<template>
  <div>
    <div v-b-toggle.scelte_consegne
      style="padding-top: 10px; padding-bottom: 10px; min-height: 45px;">

      <span class="when-opened" style="float: left; padding-left: 20px;">
        &nbsp;&nbsp;
        Personalizza
      </span>
      <span class="when-closed" style="float: left; padding-left: 20px;">
        &nbsp;&nbsp;
        <b-badge pill variant="primary">{{periodoH}}</b-badge>
        &nbsp;&nbsp;
        <b-badge pill variant="info">{{manipH}}</b-badge>
        &nbsp;&nbsp;
        <b-badge pill variant="secondary">{{group_byH}}</b-badge>
        &nbsp;&nbsp;
        <b-badge pill variant="dark">{{regioneH}}</b-badge>
      </span>
      
      <!-- b-badge pill variant="success">Success</b-badge>
      <b-badge pill variant="danger">Danger</b-badge>
      <b-badge pill variant="warning">Warning</b-badge>
      <b-badge pill variant="light">Light</b-badge -->

      <span class="when-opened">
        <!-- b-icon icon="chevron-down" aria-hidden="true"></b-icon -->
        <b-icon icon="x" aria-hidden="true"></b-icon>
      </span>
      <span class="when-closed">
        <b-icon icon="chevron-right" aria-hidden="true"></b-icon>
      </span>
    </div>


    <b-collapse id="scelte_consegne">
      <b-input-group prepend="Periodo" class="mb-2 mr-sm-2 mb-sm-0 periodo">
        <select class="custom-select" v-model="value.periodo">
          <option value="last_21">Ultimi 21 giorni</option>
          <option value="last_180">Ultimi 6 mesi</option>
          <option value="all">Tutto</option>
        </select>
      </b-input-group>

      <b-input-group prepend="Grafico" class="mb-2 mr-sm-2 mb-sm-0 grafico">
        <select class="custom-select" v-model="value.manip">
          <option value="">Giorno per giorno</option>
          <option value="incremental">Incrementale</option>
        </select>
      </b-input-group>

      <b-input-group prepend="Andamento" class="mb-2 mr-sm-2 mb-sm-0 group_by">
        <select class="custom-select" v-model="value.group_by">
          <option value="tot">Totale</option>
          <option value="reg">Regione</option>
          <option value="for">Fornitore</option>
        </select>
      </b-input-group>

      <b-input-group prepend="Regione" class="mb-2 mr-sm-2 mb-sm-0 regione">
        <select class="custom-select" v-model="value.regione">
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
      </b-input-group>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'ScelteConsegne',
  props: ['value'],
  computed: {
    periodoH() {
      if (this.value.periodo == 'last_21') return "Ultimi 21 giorni";
      if (this.value.periodo == 'last_180') return "Ultimi 6 mesi";
      return "Periodo completo";
    },
    manipH() {
      if (this.value.manip == 'incremental') return "Incrementale";
      return "Giorno per giorno";
    },
    group_byH() {
      if (this.value.group_by == 'reg') return "Regione";
      if (this.value.group_by == 'for') return "Fornitore";
      return "Andamento complessivo";
    },
    regioneH() {
      if (this.value.regione == 'all') return "Tutta Italia";
      return this.value.regione;
    }
  }
}
</script>
