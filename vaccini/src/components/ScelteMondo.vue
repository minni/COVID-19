<template>
  <div>
    <div v-b-toggle.scelte_mondo
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
        <b-badge pill variant="dark">{{paeseH}}</b-badge>
        &nbsp;&nbsp;
        <b-badge pill variant="light" v-if="value.prov">{{provH}}</b-badge>
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


    <b-collapse id="scelte_mondo">
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

      <b-input-group prepend="Paese" class="mb-2 mr-sm-2 mb-sm-0 paese">
        <select class="custom-select" v-model="value.paese">
          <option value="all">Tutti</option>
          <option value="top_dec">Top 15 Deceduti</option>
          <option value="top_ter">Top 15 Terapie Intensive</option>
          <option value="top_cas">Top 15 Casi</option>
          <option v-for="item in listaPaesi" :key="item">{{item}}</option>
        </select>
      </b-input-group>

      <b-input-group v-if="showAree"
        prepend="Area" class="mb-2 mr-sm-2 mb-sm-0 prov">
        <select class="custom-select" v-model="value.prov">
          <option value="all">Tutte</option>
          <option v-for="item in listaAree" :key="item">{{item}}</option>
        </select>
      </b-input-group>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'ScelteMondo',
  props: ['value', 'paesi', 'aree'],
  computed: {
    listaPaesi(){
      return this.paesi || [];
    },
    listaAree(){
      return this.aree[this.value.paese] || [];
    },
    periodoH() {
      if (this.value.periodo == 'last_21') return "Ultimi 21 giorni";
      if (this.value.periodo == 'last_180') return "Ultimi 6 mesi";
      return "Periodo completo";
    },
    manipH() {
      if (this.value.manip == 'incremental') return "Incrementale";
      return "Giorno per giorno";
    },
    paeseH() {
      if (this.value.regione == 'all') return "Tutta il mondo";
      return this.value.regione;
    },
    provH() {
      if (this.value.regione == 'all') return "Tutta Italia";
      return this.value.regione;
    },
    showAree() {
      return this.aree.length > 0 ? true : false;
    }
  }
}
</script>
