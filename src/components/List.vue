<template>
  <v-container>
    <v-list class="mx-auto pa-2 rounded-xl indigo lighten-1">
      <v-container>
        <v-col>
          <v-row class="justify-space-between font-italic">
            <v-col id="invisible">
              <p class="body-2 white--text text-center my-0">POKEMON</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">NOMBRE</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">VIDA</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">ATQ</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">DEF</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">VEL</p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center my-0">EXP</p>
            </v-col>
          </v-row>
        </v-col>
      </v-container>
      <v-list-item
        v-for="(item, index) in pokemonsFilter"
        :key="index"
        class="rounded-xl mb-2"
        :class="{
          [getTypeClass(item.type[0])]: true,
        }"
      >
        <v-container>
          <v-row
            class="justify-space-between"
            style="text-shadow: #6a6a6a 1px 0 10px"
          >
            <v-col id="invisible">
              <img width="60px" class="text-center my-auto" :src="item.img" />
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center mt-6 text-capitalize">
                {{ item.name }}
              </p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center mt-6">
                {{ item.hp }}
              </p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center mt-6">
                {{ item.attack }}
              </p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center mt-6">
                {{ item.defense }}
              </p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text text-center mt-6">
                {{ item.speed }}
              </p>
            </v-col>
            <v-col class="wrap">
              <p class="body-2 white--text mtext-center mt-6">
                {{ item.baseExperience }}
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item>
    </v-list>
  </v-container>
</template>
  
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "list",
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
    ...mapState(["user", "typeColor"]),
    ...mapGetters(["pokemonsFilter"]),
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  #invisible {
    display: none;
  }
  .wrap {
    white-space: nowrap;
    overflow: hidden;
    margin-left: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>