<template>
  <v-row>
    <v-col>
      <v-card
        max-width="1000px"
        class="mx-auto blue-grey darken-3 rounded-xl white--text"
      >
        <v-container>
          <v-row class="pa-5">
            <p class="my-auto" id="wrap">Bienvenid@ {{ user.name }}</p>
            <v-spacer></v-spacer>
            <v-row class="justify-end pr-2">
              <p class="my-auto pr-2">{{ user.coins }}</p>
              <v-img
                max-width="25px"
                class="my-auto"
                src="../assets/pokecoin.png"
              />
            </v-row>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "info",
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  #wrap {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 12em;
  }
}
</style>