import Vue from "vue";
import Vuex from "vuex";
import { firebase, auth, db } from "@/firebase";
import router from "@/router";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: "",
    pokemons: [],
    coins: 0,
    search: "",
    typeColor: {
      normal: "lime lighten-2",
      fire: "orange lighten-2",
      bug: "light-green lighten-2",
      grass: "green lighten-1",
      water: "blue lighten-2",
      electric: "yellow lighten-2",
      rock: "brown lighten-2",
      ghost: "deep-purple lighten-1",
      psychic: "pink lighten-2",
      poison: "purple lighten-1",
      fighting: "red lighten-1",
      fairy: "indigo lighten-3",
      ground: "deep-orange lighten-3",
    },
    listPrice: {
      normal: 15,
      fire: 50,
      bug: 30,
      grass: 30,
      water: 50,
      electric: 50,
      rock: 60,
      ghost: 70,
      psychic: 40,
      poison: 40,
      fighting: 70,
      fairy: 30,
      ground: 60,
    },
    carga: false,
  },
  mutations: {
    addPokemonToState(state, pokemon) {
      state.pokemons.push(pokemon);
    },
    newUser(state, payload) {
      if (payload === null) {
        state.user = "";
      } else {
        state.user = payload;
      }
    },
    updateSearch(state, payload) {
      state.search = payload;
    },
    setPokemons(state, payload) {
      state.pokemons = payload;
    },
    setCoins(state, payload) {
      state.coins = payload;
    },
    setCarga(state, payload) {
      state.carga = payload;
    },
  },
  actions: {
    loaderFirebase({ commit }, valor) {
      commit("setCarga", valor);
    },
    async getPokemones({ commit, state }) {
      if (state.user) {
        const userId = state.user.uid;
        const userDocRef = db.collection("users").doc(userId);

        try {
          // Obtener los datos del documento
          const doc = await userDocRef.get();
          if (doc.exists) {
            const arrayPoke = doc.data().pokemons || [];
            commit("setPokemons", arrayPoke);
            return arrayPoke;
          } else {
            console.log("El documento no existe");
            return []; // Otra opción es devolver un array vacío si no existe el documento
          }
        } catch (error) {
          console.error("Error al obtener los pokemones del usuario:", error);
          throw error;
        }
      }
    },
    addCoins({ state }, coinUpdate) {
      const userDocRef = db.collection("users").doc(state.user.uid);
      userDocRef
        .update({
          coins: firebase.firestore.FieldValue.increment(coinUpdate),
        })
        .then(() => {
          // console.log("actualice coins");
        })
        .catch((error) => {
          console.error("Error al actualizar coins a la db: " + error);
        });
    },
    async addPokemon({ commit, state }, { pokemon, coinUpdate }) {
      const userDocRef = db.collection("users").doc(state.user.uid);
      try {
        await userDocRef.update({
          pokemons: firebase.firestore.FieldValue.arrayUnion(pokemon),
          coins: firebase.firestore.FieldValue.increment(-coinUpdate),
        });

        // Actualizar el array de pokemones en el estado
        commit("addPokemonToState", pokemon);
      } catch (error) {
        console.error("Error al agregar el Pokemon a la db: " + error);
      }
    },
    async setUser({ commit }, user) {
      try {
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
          // Si el documento existe, actualiza el estado
          const userData = doc.data();
          commit("newUser", userData);
          commit("setPokemons", userData.pokemons || []);
        } else {
          // Si el documento no existe, crea un nuevo usuario en Firestore
          const userNew = {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            photo: user.photoURL,
            coins: 100,
            pokemons: [],
          };

          await db.collection("users").doc(userNew.uid).set(userNew);
          // Actualiza el estado con los nuevos datos del usuario
          commit("newUser", userNew);
          commit("setPokemons", userNew.pokemons || []);
        }
      } catch (error) {
        console.log(error);
      }
    },
    searchFilter(texto, payload) {
      // console.log(payload);
      texto.commit("updateSearch", payload.toLowerCase());
    },
    SignOff({ commit }) {
      auth.signOut();
      commit("newUser", null);
      commit("setPokemons", []);
      router.push("/login");
    },
    async getPoke() {
      try {
        let datos = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        const pokemones = datos.data.results;

        if (pokemones.length > 0) {
          const urls = pokemones.map((element) => element.url);
          return urls; // Retorna el array de URLs
        }
      } catch (error) {
        console.log("error al traer pokemon " + error);
      }
    },
  },

  modules: {},
  getters: {
    getPokemonNames: (state) => {
      return state.pokemons.map((pokemon) => pokemon.name);
    },
    pokemonsFilter(state) {
      let pokemonsFilter = [];
      for (let pokemon of state.pokemons) {
        let name = pokemon.name.toLowerCase();
        let type = pokemon.type[0].toLowerCase();
        if (
          name.indexOf(state.search) >= 0 ||
          type.indexOf(state.search) >= 0
        ) {
          pokemonsFilter.push(pokemon);
        }
      }
      return pokemonsFilter;
    },
  },
});

export default store;
