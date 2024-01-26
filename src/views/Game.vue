<template>
  <v-row>
    <v-col>
      <v-card
        class="text-center mx-auto blue-grey darken-3 rounded-xl"
        max-width="1000px"
        dark
      >
        <!-- carga -->
        <div class="text-center pa-2" v-if="carga">
          <v-progress-circular
            :width="7"
            size="50"
            color="white"
            indeterminate
          ></v-progress-circular>
          <p class="font-italic">Cargando pokemones...</p>
        </div>

        <!-- presentacion -->
        <v-container v-if="!carga && visibility">
          <v-card>
            <v-card-text class="display-1 font-weight-light white--text">
              ¡Empeza La Batalla Pokémon!
            </v-card-text>
            <p class="my-0 pt-2 text-center font-italic">
              Elegi uno de tus pokémones
            </p>
            <v-divider></v-divider>
            <v-list rounded>
              <v-list-item-group>
                <v-list-item
                  v-for="(item, index) in getPokemonNames || []"
                  :key="index"
                >
                  <v-list-item-content
                    class="text-center justify-center font-italic text-capitalize"
                    @click="handlePokemonSelected(item)"
                  >
                    {{ item }}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-container>
        <p
          v-if="getPokemonNames.length === 0"
          class="pb-4 font-italic grey--text"
        >
          Debe comprar un pokémon para jugar
        </p>
      </v-card>
      <!-- interfaz juego -->
      <v-card
        class="text-center mx-auto rounded-xl"
        max-width="1000px"
        v-if="started"
      >
        <v-img class="rounded-xl" src="../assets/escenario2.png" />
        <!-- Pokemon Enemy -->
        <div
          v-if="pokemonEnemy"
          style="position: absolute; right: 10px; top: 10px"
        >
          <v-row transition="scale-transition" origin="center center">
            <v-col class="d-flex align-start">
              <v-container
                class="white ma-0 pa-2 rounded-xl font-weight-medium"
                light
                style="width: 8em"
              >
                <p class="pa-0 ma-0 text-capitalize">{{ pokemonEnemy.name }}</p>
                <v-progress-linear
                  :value="pokemonEnemy.hp"
                  class="pa-2 mb-2"
                  color="green lighten-2"
                  striped
                  background-color="grey lighten-1"
                  rounded
                  height="20"
                  ><strong>HP: {{ pokemonEnemy.hp }}</strong></v-progress-linear
                >
                <v-progress-linear
                  :value="pokemonEnemy.defense"
                  class="pa-2 ma-0"
                  color="blue lighten-2"
                  striped
                  background-color="grey lighten-1"
                  rounded
                  height="20"
                  ><strong
                    >DEF: {{ pokemonEnemy.defense }}</strong
                  ></v-progress-linear
                >
              </v-container>
            </v-col>
            <v-col>
              <v-img
                class="ma-4"
                :width="`${screenImg - screenImg * 0.5}px`"
                :src="pokemonEnemy.imgFront"
                @load="adjustContainerSize"
                ref="imgEnemy"
              />
            </v-col>
          </v-row>
        </div>
        <!-- Pokemon User -->
        <div
          v-if="pokemonUser"
          style="position: absolute; left: 10px; bottom: 10px"
        >
          <v-row transition="scale-transition" origin="center center">
            <v-col>
              <v-img
                class="ma-4"
                :width="`${screenImg}px`"
                :src="pokemonUser.imgBack"
                @load="adjustContainerSize"
                ref="imgBack"
              />
            </v-col>
            <v-col class="d-flex align-end">
              <v-container
                class="white ma-0 pa-2 rounded-xl font-weight-medium"
                light
                style="width: 8em"
              >
                <p class="pa-0 ma-0 text-capitalize">{{ pokemonUser.name }}</p>
                <v-progress-linear
                  :value="pokemonUser.hp"
                  class="pa-2 mb-2"
                  color="green lighten-2"
                  striped
                  background-color="grey lighten-1"
                  rounded
                  height="20"
                  ><strong>HP: {{ pokemonUser.hp }}</strong></v-progress-linear
                >
                <v-progress-linear
                  :value="pokemonUser.defense"
                  class="pa-2 ma-0"
                  color="blue lighten-2"
                  striped
                  background-color="grey lighten-1"
                  rounded
                  height="20"
                  ><strong
                    >DEF: {{ pokemonUser.defense }}</strong
                  ></v-progress-linear
                >
              </v-container>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <!-- turnos -->
      <v-card
        v-if="started"
        class="text-center mx-auto blue-grey darken-3 rounded-xl ma-4 pa-2"
        max-width="1000px"
        dark
      >
        <p class="my-0">{{ turn }}</p>
      </v-card>
      <!-- habilidades -->
      <v-card
        v-if="started"
        class="text-center mx-auto rounded-xl"
        max-width="1000px"
        dark
      >
        <v-list v-if="pokemonUser && !disabled" rounded class="ou">
          <p class="my-0 pt-2 text-center font-italic">Elegi una habilidad</p>
          <v-divider></v-divider>
          <v-list-item-group>
            <v-list-item
              v-for="(item, index) in pokemonUser.abilities"
              :key="index"
            >
              <v-list-item-content
                @click="startBattle()"
                class="text-center justify-center font-italic"
              >
                {{ item }}</v-list-item-content
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <!-- mensajes/efectos -->
      <v-dialog id="dialog" v-model="result" max-width="600px" class="">
        <v-container class="" style="background-color: rgba(0, 0, 0, 0.385)">
          <v-img width="40em" v-if="finished" src="../assets/youWin.png" />
          <v-img width="40em" v-else src="../assets/gameOver2.png" />
        </v-container>
      </v-dialog>

      <v-dialog id="dialog" v-model="attackUser" max-width="600px">
        <v-container style="background-color: rgba(0, 0, 0, 0.385)">
          <v-img width="40em" src="../assets/boom.png" />
        </v-container>
      </v-dialog>
      <v-dialog id="dialog" v-model="attackEnemy" max-width="600px">
        <v-container style="background-color: rgba(0, 0, 0, 0.385)">
          <v-img src="../assets/pow.png" />
        </v-container>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import { mapState, mapActions, mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "game",
  created() {
    this.init();
    this.screenImg = this.getScreenSize().width;
    this.getPokemones();
  },
  data() {
    return {
      pokemonsGame: [],
      pokemonUser: null,
      pokemonEnemy: null,
      visibility: true,
      result: false,
      finished: null,
      started: false,
      attackUser: false,
      attackEnemy: false,
      disabled: false,
      coinUpdate: 25,
      screenImg: null,
      turn: "Tu turno",
    };
  },
  methods: {
    getScreenSize() {
      let screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (screenWidth < 500) {
        screenWidth = 100;
      } else if (screenWidth > 500 && screenWidth < 900) {
        screenWidth = 200;
      } else {
        screenWidth = 300;
      }
      return {
        width: screenWidth,
      };
    },
    async startBattle() {
      await this.userTurn();
      if (this.pokemonEnemy.hp <= 0) {
        this.finished = true;
        this.result = true;
        this.visibility = true;
        this.started = false;
        this.disabled = false;
        this.$store.dispatch("addCoins", this.coinUpdate);
        this.user.coins += this.coinUpdate;
        await this.wait(2000);
        this.result = false;
        return;
      }

      await this.wait(2000);

      await this.enemyTurn();
      if (this.pokemonUser.hp <= 0) {
        this.finished = false;
        this.result = true;
        this.visibility = true;
        this.started = false;
        this.disabled = false;
        await this.wait(2000);
        this.result = false;
        return;
      }
    },
    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async userTurn() {
      await this.playerAttack();
      this.turn = "Turno del enemigo";
    },
    async enemyTurn() {
      await this.enemyAttack();
      this.turn = "Tu turno";
    },
    async playerAttack() {
      await this.wait(1000);
      this.attackUser = true;
      await this.wait(1000);
      this.pokemonEnemy = this.fighting(this.pokemonUser, this.pokemonEnemy);
      this.attackUser = false;
      this.disabled = true;
    },
    async enemyAttack() {
      await this.wait(1000);
      this.attackEnemy = true;
      await this.wait(1000);
      this.pokemonUser = this.fighting(this.pokemonEnemy, this.pokemonUser);
      this.attackEnemy = false;
      this.disabled = false;
    },
    fighting(pokemonActive, pokemonPassive) {
      const randomPercentage = Math.random() * (0.8 - 0.5) + 0.5; // Genera un porcentaje aleatorio entre 50% y 80%
      const damageDivider = 1 + randomPercentage;
      const damage = Math.round(pokemonActive.attack / damageDivider);
      pokemonPassive.defense -= damage;

      if (pokemonPassive.defense < 0) {
        pokemonPassive.defense = 0;
      }
      if (pokemonPassive.defense === 0) {
        pokemonPassive.hp -= damage;

        if (pokemonPassive.hp < 0) {
          pokemonPassive.hp = 0;
          this.result = true;
        }
      }
      return { ...pokemonPassive };
    },
    randomEnemy() {
      const randomIndex = this.getEnemyRandom();
      if (randomIndex >= 0 && randomIndex < this.pokemonsGame.length) {
        this.pokemonEnemy = this.pokemonsGame[randomIndex];
      } else {
        console.error("enemigo no encontrado:", randomIndex);
        this.pokemonEnemy = this.pokemonsGame[0];
      }
    },
    getRandomNumber() {
      // Genera un número aleatorio entre 1 y 100
      return _.random(1, 100);
    },
    getEnemyRandom() {
      // Genera un número aleatorio entre 1 y 90
      return _.random(0, 60);
    },
    adjustContainerSize() {
      const imgBack = this.$refs.imgBack;

      if (imgBack && imgBack.parentElement) {
        const container = imgBack.parentElement;
        container.style.width = imgBack.width + "px";
        container.style.height = imgBack.height + "px";
      }
    },
    handlePokemonSelected(pokemon) {
      this.pokemonsGame.forEach((element) => {
        if (element.name === pokemon) {
          this.pokemonUser = element;
        }
      });
      this.randomEnemy();
      this.visibility = false;
      this.started = true;
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
          this.$store.dispatch("loaderFirebase", false);
        }
      } catch (error) {
        console.log("Error en la inicialización: " + error);
      }
    },
    async getPokemonInfo(url) {
      try {
        let datos = await axios.get(url);
        const pokemon = datos.data;
        const abilityNames = pokemon.abilities.flatMap(
          (item) => item.ability.name
        );
        const objetoPokemon = {
          name: pokemon.name,
          hp: pokemon.stats[0].base_stat,
          attack: pokemon.stats[1].base_stat,
          defense: pokemon.stats[2].base_stat,
          speed: pokemon.stats[5].base_stat,
          imgFront: pokemon.sprites.other.showdown.front_default,
          imgBack: pokemon.sprites.other.showdown.back_default,
          abilities: abilityNames,
        };

        this.pokemonsGame.push(objetoPokemon);
        // console.log(pokemon);
      } catch (error) {
        console.log("error al traer info " + error);
      }
    },
    ...mapActions(["addCoins", "getPokemones"]),
  },
  computed: {
    ...mapState(["user", "carga", "namesPoke"]),
    ...mapGetters(["getPokemonNames"]),
  },
};
</script>