<template>
  <v-card>
    <v-card-text class="display-1 font-weight-light white--text">
      ¡Empeza La Batalla Pokémon!
    </v-card-text>
    <p class="my-0 pt-2 text-center font-italic">Elegi uno de tus pokémones</p>
    <v-divider></v-divider>
    <v-list rounded>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in namesPoke || []" :key="index">
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
</template>

<script>
export default {
  methods: {
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
  },
};
</script>