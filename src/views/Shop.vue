<template>
  <v-row>
    <v-col>
      <v-card
        class="text-center mx-auto blue-grey darken-3 rounded-xl"
        max-width="1000px"
        dark
      >
        <v-card-text class="display-1 font-weight-light white--text">
          Tienda
        </v-card-text>
        <div class="text-center pa-2" v-if="carga">
          <v-progress-circular
            :width="7"
            size="50"
            color="white"
            indeterminate
          ></v-progress-circular>
          <p class="font-italic">Cargando pokemones...</p>
        </div>

        <v-container v-if="!carga">
          <v-row>
            <v-col
              v-for="(item, index) in pokemons"
              :key="index"
              cols="12"
              md="4"
              sm="6"
            >
              <v-card
                class="rounded-xl"
                :class="{
                  [getTypeClass(item.type[0])]: true,
                }"
              >
                <v-card
                  shaped
                  style="position: absolute; background-color: transparent"
                >
                  <v-col>
                    <p
                      class="font-weight-bold"
                      style="text-shadow: #6a6a6a 1px 0 10px"
                    >
                      Precio: {{ getListPrice(item.type[0]) }}
                    </p>
                  </v-col>
                </v-card>

                <img
                  width="200px"
                  class="text-center my-auto"
                  :src="item.img"
                />
                <v-card-text class="indigo darken-1 ma-0">
                  <v-row class="my-auto px-3">
                    <v-btn
                      class="light-blue darken-1 rounded-xl my-auto"
                      @click="addPokemonToCart(item)"
                      >Comprar</v-btn
                    >
                    <v-spacer></v-spacer>

                    <p class="subtitle-1 white--text my-auto text-capitalize">
                      {{ item.name }}
                    </p>

                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      fab
                      class="my-auto"
                      @click="clickPokemonInfo(item)"
                    >
                      <v-icon>fas fa-info-circle</v-icon>
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <!-- snackbar user -->
    <v-snackbar v-model="snackbar" rounded="pill" :color="colorSnackbar">
      <template v-slot:action="{ attrs }">
        <v-btn fab text v-bind="attrs" @click="snackbar = false">
          <v-icon>fas fa-times-circle</v-icon>
        </v-btn>
      </template>
      <p class="font-italic white--text ma-0">{{ textSnackbar }}</p>
      <v-progress-linear
        color="white"
        v-if="showProgressBar"
        :value="progressValue"
        height="4"
        class="mt-2"
      ></v-progress-linear>
    </v-snackbar>
    <!-- Modal info pokemon -->
    <v-dialog v-if="selectedPokemon" v-model="dialog" dark max-width="500px">
      <v-card
        class="rounded-xl"
        :class="{
          [getTypeClass(selectedPokemon.type[0])]: true,
        }"
      >
        <v-container>
          <v-row>
            <v-col>
              <v-col
                class="rounded-xl blue darken-2 text-center body-2 ma-0 mb-2"
              >
                <p class="ma-0">VIDA: {{ selectedPokemon.hp }}</p>
                <p class="ma-0">ATQ: {{ selectedPokemon.attack }}</p>
                <p class="ma-0">DEF: {{ selectedPokemon.defense }}</p>
                <p class="ma-0">VEL: {{ selectedPokemon.speed }}</p>
                <p class="ma-0">EXP:{{ selectedPokemon.baseExperience }}</p>
              </v-col>
              <v-card-text class="blue-grey darken-1 rounded-xl">
                <p class="text-capitalize">
                  Nombre: {{ selectedPokemon.name }}
                </p>
                <p class="text-capitalize">
                  Tipo: {{ selectedPokemon.type.join(", ") }}
                </p>
                <p class="text-capitalize">
                  Habiladades: {{ selectedPokemon.abilities.join(", ") }}
                </p>
                <p class="ma-0 text-capitalize">
                  Especie: {{ selectedPokemon.species }}
                </p>
              </v-card-text>
            </v-col>
            <v-col class="text-center my-auto">
              <img width="200px" :src="selectedPokemon.img" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "shop",
  data() {
    return {
      pokemons: [],
      dialog: false,
      snackbar: false,
      colorSnackbar: "",
      textSnackbar: "",
      selectedPokemon: null,
      progressBarDuration: 5000,
      showProgressBar: false,
      progressValue: 0,
      progressBarInterval: null,
    };
  },
  watch: {
    snackbar(newVal) {
      if (newVal) {
        this.showProgressBar = true;
        this.startProgressBar();
      } else {
        this.showProgressBar = false;
        this.resetProgressBar();
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    startProgressBar() {
      this.progressValue = 0;
      const interval = 100;
      const steps = this.progressBarDuration / interval;
      this.progressBarInterval = setInterval(() => {
        this.progressValue += 100 / steps;
        if (this.progressValue >= 100) {
          this.snackbar = false;
          // Ocultar el Snackbar cuando la barra de progreso alcanza el 100%
        }
      }, interval);
    },
    resetProgressBar() {
      clearInterval(this.progressBarInterval);
    },
    ...mapActions(["addPokemon"]),
    addPokemonToCart(pokemon) {
      const coinUpdate = this.getListPrice(pokemon.type[0]);

      if (this.user.coins >= coinUpdate) {
        // Resta las monedas y actualiza el estado
        this.user.coins = this.user.coins - coinUpdate;

        // Llama a la acción para agregar el Pokémon y actualizar las monedas
        this.$store.dispatch("addPokemon", { pokemon, coinUpdate });
        this.snackbar = true;
        this.colorSnackbar = "green accent-4";
        this.textSnackbar = "Compra realizada con éxito";
      } else {
        this.snackbar = true;
        this.colorSnackbar = "red darken-1";
        this.textSnackbar = "No hay plata";
      }
    },

    getListPrice(type) {
      return this.listPrice[type] || 0;
    },
    getTypeClass(type) {
      return this.typeColor[type] || "";
    },
    clickPokemonInfo(pokemon) {
      this.selectedPokemon = pokemon;
      this.dialog = true;
    },
    async init() {
      try {
        this.$store.dispatch("loaderFirebase", true);
        const urls = await this.$store.dispatch("getPoke");
        if (urls && urls.length > 0) {
          // Llama a getPokemonInfo para cada URL
          for (const url of urls) {
            await this.getPokemonInfo(url);
          }
        }
      } catch (error) {
        console.log("Error en la inicialización: " + error);
      }
    },
    async getPokemonInfo(url) {
      try {
        let datos = await axios.get(url);
        const pokemon = datos.data;
        const TypeNames = pokemon.types.flatMap((item) => item.type.name);
        const abilityNames = pokemon.abilities.flatMap(
          (item) => item.ability.name
        );
        const objetoPokemon = {
          name: pokemon.name,
          hp: pokemon.stats[0].base_stat,
          attack: pokemon.stats[1].base_stat,
          defense: pokemon.stats[2].base_stat,
          speed: pokemon.stats[5].base_stat,
          img: pokemon.sprites.other.home.front_default,
          type: TypeNames,
          abilities: abilityNames,
          baseExperience: pokemon.base_experience,
          species: pokemon.species.name,
        };

        this.pokemons.push(objetoPokemon);
        setTimeout(() => {
          this.$store.dispatch("loaderFirebase", false);
        }, 1000);
        // console.log(pokemon);
      } catch (error) {
        console.log("error al traer info " + error);
      }
    },
  },
  computed: {
    ...mapState(["user", "typeColor", "listPrice", "carga"]),
  },
};
</script>