<template>
  <v-app>
    <v-app-bar app color="dark" dark>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <router-link :to="{ name: 'Home' }">
          <v-btn text>
            <span class="mr-2">Pinture</span>
          </v-btn>
        </router-link>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>

<style scoped>
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: white;
}

a:active {
  text-decoration: underline;
  color: white;
}
</style>
