<template>
  <div id="app">
    
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand href="/">{{currentRouteName}}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/consegne">Consegne</b-nav-item>
          <b-nav-item to="/vaccinazioni">Vaccinazioni</b-nav-item>
          <b-nav-item to="/mondo">Mondo</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- div id="nav">
      <router-link to="/consegne">Consegne</router-link> |
      <router-link to="/vaccinazioni">Vaccinazioni</router-link> |
      <router-link to="/about">About</router-link>
    </div -->
    
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted: function(){
    // let root = this.myprop || '/consegne'
    let root = '/consegne';
    this.$router.push({ path: root });
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
