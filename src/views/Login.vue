<template>
  <v-container>
    <v-col class="text-center">
      <v-container style="background-color: transparent; max-width: 600px">
        <v-img src="../assets/Pokemon.png"></v-img>
      </v-container>
      <v-card
        class="text-center mx-auto blue-grey darken-3 rounded-xl pa-2"
        max-width="800px"
        dark
      >
        <h1 class="white--text">Inicia sesion</h1>
        <v-card
          outlined
          max-width="400px"
          class="pa-2 mx-auto blue-grey darken-2 rounded-xl"
        >
          <v-btn class="mb-2" block @click="google">
            <v-icon left dark>fab fa-google</v-icon>
            Google
          </v-btn>
          <v-btn block class="white--text blue darken-4" @click="facebook">
            <v-icon left dark>fab fa-facebook-f</v-icon>
            Facebook
          </v-btn>
        </v-card>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { firebase, auth } from "@/firebase";
import { mapMutations, mapActions } from "vuex";
import router from "@/router";

export default {
  name: "login",
  methods: {
    ...mapMutations(["newUser"]),
    ...mapActions(["setUser"]),
    facebook() {
      console.log("Face");
      const provider = new firebase.auth.FacebookAuthProvider();
      this.access(provider);
    },
    google() {
      console.log("google");
      const provider = new firebase.auth.GoogleAuthProvider();
      this.access(provider);
    },

    async access(provider) {
      firebase.auth().languageCode = "es";
      try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        this.setUser(user);

        router.push({ name: "home" });
      } catch (error) {
        console.log("error de sesion " + error);
      }
    },
  },
};
</script>