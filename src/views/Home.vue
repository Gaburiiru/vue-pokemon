<template>
  <v-row>
    <v-col>
      <v-card
        class="text-center mx-auto blue-grey darken-3 rounded-xl"
        max-width="1000px"
        dark
      >
        <v-card-text class="display-1 font-weight-light white--text">
          Tu coleccion
        </v-card-text>
        <v-container>
          <v-card class="blue-grey darken-1 rounded-xl">
            <v-row class="ma-0 justify-space-between">
              <v-row class="justify-start my-auto mx-auto">
                <v-icon class="ml-4 mr-4">fas fa-filter</v-icon>
                <v-text-field
                  v-model="search"
                  color="blue lighten-3"
                  type="text"
                  label="Busque su pokémon por nombre o tipo"
                  v-on:keyup="searchFilter(search)"
                  id="input"
                />
              </v-row>
              <v-row
                class="justify-end my-auto mx-auto"
                style="max-width: 150px"
              >
                <v-btn text @click="Selection = true"
                  ><v-icon>fas fa-th-list</v-icon></v-btn
                >
                <v-btn @click="Selection = false" text
                  ><v-icon>fas fa-th-large</v-icon></v-btn
                >
              </v-row>
            </v-row>
          </v-card>
        </v-container>
        <!-- Aca se va a mostrar card o list -->
        <div class="text-center pa-2" v-if="carga">
          <v-progress-circular
            :rotate="360"
            :size="100"
            :width="15"
            :value="value"
            color="teal"
          >
            {{ value }}
          </v-progress-circular>
          <p class="font-italic pa-2">Cargado pokémones...</p>
        </div>
        <div v-if="!carga">
          <Card v-if="Selection == false" />
          <List v-else />
          <p v-if="pokemonsFilter.length === 0" class="pb-4 font-italic grey--text">
            No Hay Pokémones
          </p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Card from "../components/Card.vue";
import List from "../components/List.vue";

export default {
  name: "Home",
  data() {
    return {
      search: "",
      Selection: false,
      intervalId: null,
      value: 0,
    };
  },
  created() {
    this.getPokemones();
    this.$store.dispatch("loaderFirebase", true);
    this.intervalId = setInterval(() => {
      if (this.value === 100) {
        clearInterval(this.intervalId);
        setTimeout(() => {
          this.$store.dispatch("loaderFirebase", false);
        }, 800);
        return (this.value = 0);
      }
      this.value += 20;
    }, 500);
  },
  methods: {
    getTypeClass(type) {
      return this.typeColor[type] || "";
    },
    ...mapActions(["searchFilter", "getPokemones"]),
  },
  computed: {
    ...mapState(["carga"]),
    ...mapGetters(["pokemonsFilter"]),
  },
  components: {
    Card,
    List,
  },
};
</script>
<style>
@media screen and (max-width: 600px) {
  #invisible {
    display: none;
  }
  #input{
    width: 5em;
  }
}
</style>