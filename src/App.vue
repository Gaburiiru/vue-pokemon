<template>
  <v-app style="background-color: #311B92; padding: 0; margin: 0;">
    <navbar v-if="user != ''"/>
    <v-main style="padding: 0px; margin-top: 2rem;">
      <info v-if="user != ''" style="position: sticky; top: 50px; z-index: 5;"/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./components/Navbar.vue";
import info from "./components/Info.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    navbar,
    info,
  },
  data: () => ({}),
  computed: {
    ...mapState(["user"]),
  },
};
</script>
