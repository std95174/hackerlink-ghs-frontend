<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline">Make Your Photo NFT</v-card-title>
      <v-card-text>
        <div>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                IPFS
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2"> NFT </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Done! </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title>Upload Your Photo to IPFS</v-card-title>
                </v-card>
                <div class="text-right">
                  <v-btn color="primary" @click="e1 = 2"> Continue </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title> Make a NFT </v-card-title>
                </v-card>
                <div class="text-right">
                  <v-btn text @click="e1 = 1" class="mr-3">
                    <v-icon>mdi-arrow-left</v-icon>Previous
                  </v-btn>
                  <v-btn color="primary" @click="e1 = 3"> Continue </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title>We1l Done</v-card-title>
                  <v-card-text>
                    <div>
                      It's great that you make you photo a NFT. Now, time to
                      make a its license NFT and make some money!
                    </div>
                    <div>
                      Your picture on IPFS:
                      <v-btn
                        href="http://ipfs.infura.io:5001/api/v0/cat?arg=QmNYwRFaQTYzN1FxvTkjMVPHiTvAw53EmziLjLDa921u23"
                        target="black"
                        small
                        text
                      >
                        click me
                        <v-icon>mdi-image</v-icon>
                      </v-btn>
                    </div>
                    <div>Your NFT ID on Smart Contract: <span>1</span></div>
                    <div>
                      Transaction on blockchain:
                      <v-btn
                        href="http://ipfs.infura.io:5001/api/v0/cat?arg=QmNYwRFaQTYzN1FxvTkjMVPHiTvAw53EmziLjLDa921u23"
                        target="black"
                        small
                        text
                      >
                        click me
                        <v-icon>mdi-link-lock</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
                <div class="text-right">
                  <v-btn text @click="e1 = 2" class="mr-3">
                    <v-icon>mdi-arrow-left</v-icon>Previous
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="
                      dialog = false;
                      el = 1;
                    "
                  >
                    Done and Close
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="close">Close</v-btn>
        <!-- <v-btn color="red darken-1" text >確定</v-btn> -->
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PhotoNFT",
  props: {
    value: Boolean
  },
  data() {
    return {
      e1: 1
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>