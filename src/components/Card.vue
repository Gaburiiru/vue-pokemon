<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in pokemonsFilter"
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
            <v-col class="my-auto font-weight-light body-2" style="text-shadow: #6a6a6a 1px 0 10px;">
              <p>VIDA: {{ item.hp }}</p>
              <p>ATQ: {{ item.attack }}</p>
              <p>DEF: {{ item.defense }}</p>
              <p>VEL: {{ item.speed }}</p>
              <p>EXP:{{ item.baseExperience }}</p>
            </v-col>
          </v-card>

          <img width="200px" class="text-center my-auto" :src="item.img" />
          <v-card-text class="indigo darken-1">
            <p class="subtitle-1 white--text ma-0 text-capitalize">{{ item.name }}</p>
          </v-card-text>
          
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "card",
  data() {
    return {};
  },
  created() {},
  methods: {
    getTypeClass(type) {
      return this.typeColor[type] || "";
    },
  },
  computed: {
    ...mapState([ "typeColor"]),
    ...mapGetters(["pokemonsFilter"]),
  },
};
</script>