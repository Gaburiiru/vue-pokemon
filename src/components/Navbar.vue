<template>
  <v-container class="mt-6">
    <v-app-bar color="deep-purple accent-4" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Pokémon</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn type="submit" @click="SignOff">
        Cerrar sesión
        <v-icon class="ml-4">fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app class="deep-purple accent-4" dark>
      <v-col align-content-center>
        <v-row class="justify-center ma-2">
          <v-list-item-avatar>
            <v-img :src="user.photo"></v-img>
          </v-list-item-avatar>
        </v-row>
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    drawer: false,
    group: null,
    items: [
      { title: "Home", icon: "fas fa-home", to: { name: "home" } },
      { title: "Tienda", icon: "fas fa-store", to: { name: "shop" } },
      { title: "Juegos", icon: "fas fa-gamepad", to: { name: "game" } },
    ],
  }),
  methods: {
    ...mapActions(["SignOff"]),
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>