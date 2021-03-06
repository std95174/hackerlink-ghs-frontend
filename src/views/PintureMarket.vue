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

    <v-row align="center" justify="center" class="mb-3 mr-3 ml-3">
      <v-card width="75vw">
        <v-toolbar dark flat>
          <v-toolbar-title>
            {{ tabItems[tab] }}
          </v-toolbar-title>
          <v-badge
            :value="hover"
            color="deep-purple accent-4"
            content="The picuture is a sample, buy license to see actual size picture"
            right
            transition="slide-y-transition"
          >
            <v-hover v-model="hover">
              <v-icon>mdi-alert-circle</v-icon>
            </v-hover>
          </v-badge>

          <template v-slot:extension>
            <v-tabs v-model="tab" align-with-title>
              <v-tabs-slider color="white"></v-tabs-slider>

              <!-- <v-tab v-for="item in tabItems" :key="item">
                {{ item }}
              </v-tab> -->
              <v-tab>Market</v-tab>
              <v-tab @click="getLicenseTokens">My Licenses</v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table
              :headers="headers"
              :items="pintures"
              :no-data-text="
                pintures.length == 0 && loading
                  ? 'Trying to get licenses...'
                  : 'There\'s no license on sale now'
              "
              :loading="loading"
              dark
              height="60vh"
            >
              <template v-slot:[`item.photo`]="{ item }">
                <v-container>
                  <v-row align="center" justify="center" class="pa-3">
                    <v-flex xs4>
                      <v-layout justify-center align-center>
                        <v-img
                          width="350"
                          :src="`http://ipfs.infura.io:5001/api/v0/cat?arg=${item.photo}`"
                        >
                        </v-img>
                      </v-layout>
                    </v-flex>
                  </v-row>
                </v-container>
              </template>

              <template v-slot:[`item.licensePicture`]="{ item }">
                <v-container>
                  <v-row align="center" justify="center" class="pa-3">
                    <v-flex xs4>
                      <v-layout justify-center align-center>
                        <v-img
                          width="350"
                          :src="`http://ipfs.infura.io:5001/api/v0/cat?arg=${item.licenseTokenUri}`"
                        >
                        </v-img>
                      </v-layout>
                    </v-flex>
                  </v-row>
                </v-container>
              </template>

              <template v-slot:[`item.price`]="{ item }">
                {{ item.price }} ETH
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  @click="buy(item.tokenId, item.price)"
                  outlined
                  :disabled="txLoading"
                  :loading="txLoading"
                >
                  Buy
                </v-btn>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-data-table
              :headers="licenseHeaders"
              :items="licenseTokens"
              :loading="tableLoading"
              :no-data-text="
                licenseTokens.length == 0 && tableLoading
                  ? 'Trying to get licenses...'
                  : 'You don\'t have any license yet, take a photo a make your own NFT!'
              "
              height="60vh"
              dark
            >
              <template v-slot:[`item.photo`]="{ item }">
                <v-container>
                  <v-row align="center" justify="center" class="pa-3">
                    <v-flex xs4>
                      <v-layout justify-center align-center>
                        <v-img
                          width="250"
                          :src="`http://ipfs.infura.io:5001/api/v0/cat?arg=${item.photo}`"
                        >
                        </v-img>
                      </v-layout>
                    </v-flex>
                  </v-row>
                </v-container>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="txLoading"
                  @click="cancel(item.tokenId)"
                  outlined
                  v-if="item.isOnSale"
                >
                  Stop Selling
                </v-btn>
                <span v-else>Not for Sale</span>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-row>
  </v-parallax>
</template>
  
<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import {
  pintureWithSigner,
  licenseTokenWithSigner,
  pictureTokenWithSigner
} from "@/common/contract";

export default {
  name: "PintureMarket",
  data() {
    return {
      show: false,
      tab: "tab",
      tabItems: ["Market", "My Licenses"],
      headers: [
        // { text: "Token ID", align: "center", value: "tokenId", width: "10%" },
        // { text: "Token URI", align: "center", value: "tokenUri" },
        { text: "Picture", align: "center", value: "photo" },
        { text: "License", align: "center", value: "licensePicture" },
        { text: "Price", align: "center", value: "price" },
        { text: "Quantity", align: "center", value: "quantity" },
        { text: "Start", align: "center", value: "startTime" },
        { text: "End", align: "center", value: "endTime" },
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false
        }
      ],
      pintures: [],

      licenseHeaders: [
        // { text: "Token ID", align: "center", value: "tokenId", width: "10%" },
        // { text: "Token URI", align: "center", value: "tokenUri" },
        { text: "License", align: "center", value: "photo" },
        { text: "Quantity", align: "center", value: "quantity" },
        { text: "Start", align: "center", value: "startTime" },
        { text: "End", align: "center", value: "endTime" },
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false
        }
      ],
      licenseTokens: [],
      loading: false,
      tableLoading: false,
      txLoading: false,

      hover: false
    };
  },
  methods: {
    buy(tokenId, price) {
      console.log(this.currentAccount);
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }
      try {
        this.txLoading = true;
        pintureWithSigner.buy(tokenId._hex, {
          value: ethers.utils.parseEther(price)
        });
      } catch (error) {
        this.txLoading = false;
        console.log(error);
        alert("something error");
        return;
      }

      try {
        const vm = this;
        pintureWithSigner.on("Buy", (licenseTokenId, buyer, price, event) => {
          vm.txLoading = false;
          console.log(event);
          this.getPintures();
          this.getLicenseTokens();
          alert(
            `Congratulations!! You've bought a License, ID: ${licenseTokenId}`
          );
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getPintures() {
      this.pintures.length = 0;
      this.loading = true;
      const tokens = await pintureWithSigner.getListedTokens();
      const vm = this;
      for (let i = 0; i < tokens.length; i++) {
        pintureWithSigner.getPrice(tokens[i]).then((price) => {
          licenseTokenWithSigner
            .getLicenseTokenInfo(tokens[i])
            .then((licenseTokenInfo) => {
              Promise.all([
                pictureTokenWithSigner.tokenURI(licenseTokenInfo[0]),
                licenseTokenWithSigner.tokenURI(tokens[i])
              ]).then((response) => {
                const pictureCid = response[0].split("ipfs://");
                const licenseCid = response[1].split("ipfs://");
                vm.pintures.push({
                  tokenId: tokens[i], // license
                  price: ethers.utils.formatEther(price),
                  tokenUri: response[0],
                  photo: pictureCid[1], // picture
                  licenseTokenUri: licenseCid[1],
                  quantity: licenseTokenInfo[1],
                  startTime: new Date(licenseTokenInfo[2].toNumber())
                    .toISOString()
                    .substr(0, 10),
                  endTime: new Date(licenseTokenInfo[3].toNumber())
                    .toISOString()
                    .substr(0, 10)
                });
              });
            });
        });
      }
      this.loading = false;
    },
    async getLicenseTokens() {
      this.licenseTokens.length = 0;
      if (this.currentAccount == "") {
        alert("connect metamask first");
        this.tab = 0;
        return;
      }
      const balance = await licenseTokenWithSigner.balanceOf(
        this.currentAccount
      );
      if (balance == 0) {
        alert("sorry, you don't have any licenses");
        this.tableLoading = false;
        return;
      }
      const vm = this;
      this.tableLoading = true;
      console.log(this.currentAccount);

      for (let index = 0; index < balance; index++) {
        licenseTokenWithSigner
          .tokenOfOwnerByIndex(this.currentAccount, index)
          .then((tokenId) => {
            licenseTokenWithSigner.tokenURI(tokenId).then((tokenUri) => {
              licenseTokenWithSigner
                .getLicenseTokenInfo(tokenId)
                .then((licenseTokenInfo) => {
                  {
                    pintureWithSigner.getPrice(tokenId).then((price) => {
                      const cid = tokenUri.split("ipfs://");
                      vm.licenseTokens.push({
                        tokenId: tokenId,
                        tokenUri: tokenUri,
                        photo: cid[1],
                        quantity: licenseTokenInfo[1],
                        startTime: new Date(licenseTokenInfo[2].toNumber())
                          .toISOString()
                          .substr(0, 10),
                        endTime: new Date(licenseTokenInfo[3].toNumber())
                          .toISOString()
                          .substr(0, 10),
                        isOnSale:
                          ethers.utils.formatEther(price) == 0 ? false : true
                      });
                    });
                  }
                });
            });
            if (index == balance - 1) {
              vm.tableLoading = false;
            }
          });
      }
    },
    cancel(tokenId) {
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }
      try {
        this.txLoading = true;
        pintureWithSigner.cancel(tokenId);
      } catch (error) {
        this.txLoading = false;
        console.log(error);
        alert("something error");
        return;
      }

      try {
        const vm = this;
        pintureWithSigner.on("Cancel", (licenseTokenId, event) => {
          vm.txLoading = false;
          console.log(event);
          this.getPintures();
          alert(`Your license had removed from market`);
        });
      } catch (error) {
        console.log(error);
      }
    }
  },

  async mounted() {
    await this.getPintures();
  },
  created() {
    const vm = this;
    setTimeout(function () {
      vm.show = true;
    }, 500);
  },
  computed: {
    ...mapGetters(["currentAccount"])
  }
};
</script>