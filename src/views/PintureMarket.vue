<template>
  <v-parallax
    src="https://images.unsplash.com/photo-1447710441604-5bdc41bc6517?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
    style="height: 100vh"
  >
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <v-slide-y-transition>
          <div v-show="show">
            <h1 class="display-1 font-weight-thin mb-4">Pinture Market</h1>
            <h3 class="subheading">
              <span class="text-decoration-underline">Pinture Market</span> is a
              place where you can buy Photo's licenses.
            </h3>
          </div>
        </v-slide-y-transition>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-data-table></v-data-table>
    </v-row>
    <v-row class="mr-6 ml-6 pa-6">
      <v-col>
        <span> </span>
      </v-col>
    </v-row>
  </v-parallax>
</template>
  
<script>
export default {
  name: "PintureMarket",
  data() {
    return {
      show: false
    };
  },
  created() {
    const vm = this;
    setTimeout(function () {
      vm.show = true;
    }, 500);
  }
};
</script>