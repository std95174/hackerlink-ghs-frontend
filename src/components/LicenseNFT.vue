<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline">Make Your License NFT</v-card-title>
      <v-card-text>
        <div>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                License
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2"> NFT </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Done! </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color=" lighten-1">
                  <v-card-title>
                    <span class="mr-3">Choose a Pinture</span>
                    <v-btn @click="getBalance"
                      >Get your Pinture NFTs</v-btn
                    ></v-card-title
                  >
                  <div>
                    <v-data-table
                      :headers="headers"
                      :items="pintureTokens"
                      :loading="tableLoading"
                    >
                      <template v-slot:[`item.actions`]="{}">
                        <v-btn color="primary" @click="e1 = 2">
                          Continue
                        </v-btn>
                      </template>
                      <template v-slot:[`item.photo`]="{ item }">
                        <v-row>
                          <v-spacer></v-spacer>
                          <v-img
                            width="150"
                            :src="`http://ipfs.infura.io:5001/api/v0/cat?arg=${item.photo}`"
                          >
                          </v-img>
                          <v-spacer></v-spacer>
                        </v-row>
                      </template>
                    </v-data-table>
                  </div>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title> Config Your License </v-card-title>
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
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import pintureTokenJson from "../assets/contracts/PintureToken.json";
export default {
  name: "LicenseNFT",
  props: {
    value: Boolean
  },
  data() {
    return {
      e1: 1,
      headers: [
        {
          text: "Index",
          align: "center",
          value: "index",
          width: "10%"
        },
        { text: "Token ID", align: "center", value: "tokenId", width: "10%" },
        { text: "Token URI", align: "center", value: "tokenURI", width: "20%" },
        { text: "Photo", align: "center", value: "photo", width: "40%" },
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "20%"
        }
      ],
      pintureTokens: [],
      tableLoading: false
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },
    async getBalance() {
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      const contractAddress = process.env.VUE_APP_PINTURE_CONTRACT_ADDRESS;
      const abi = pintureTokenJson.abi;

      // The Contract object
      const pintureTokenContract = new ethers.Contract(
        contractAddress,
        abi,
        ethersJsProvider
      );
      const pintureTokenWithSigner = pintureTokenContract.connect(
        ethersJsProvider.getSigner()
      );
      const balance = await pintureTokenWithSigner.balanceOf(
        this.currentAccount
      );
      const vm = this;
      this.tableLoading = true;
      for (let index = 0; index < balance; index++) {
        pintureTokenWithSigner
          .tokenOfOwnerByIndex(this.currentAccount, index)
          .then((tokenId) => {
            pintureTokenWithSigner.tokenURI(tokenId).then((tokenURI) => {
              const photo = tokenURI.split("ipfs://");
              vm.pintureTokens.push({
                index: index,
                tokenId: tokenId.toNumber(),
                tokenURI: tokenURI,
                photo: photo[1]
              });
            });
            if (index == balance - 1) {
              vm.tableLoading = false;
            }
          });
      }
    }
  },
  computed: {
    ...mapGetters(["currentAccount"]),
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