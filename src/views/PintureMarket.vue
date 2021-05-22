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
      <v-data-table
        :headers="headers"
        :items="pintures"
        no-data-text="trying to get licenses..."
        :loading="loading"
        dark
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
    </v-row>
  </v-parallax>
</template>
  
<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import { pintureWithSigner, licenseTokenWithSigner } from "@/common/contract";

export default {
  name: "PintureMarket",
  data() {
    return {
      show: false,
      headers: [
        // { text: "Token ID", align: "center", value: "tokenId", width: "10%" },
        // { text: "Token URI", align: "center", value: "tokenUri" },
        { text: "Photo", align: "center", value: "photo" },
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
      loading: false,
      txLoading: false
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
        this.loading = true;
        pintureWithSigner.buy(tokenId, {
          value: ethers.utils.parseEther(price)
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
        alert("something error");
        return;
      }

      try {
        const vm = this;
        pintureWithSigner.on("Buy", (licenseTokenId, buyer, price, event) => {
          vm.loading = false;
          console.log(event);
          alert(
            `Congratulations!! You've bount a License, ID: ${licenseTokenId}`
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  async mounted() {
    this.loading = true;
    const tokens = await pintureWithSigner.getListedTokens();
    const vm = this;
    for (let i = 0; i < tokens.length; i++) {
      pintureWithSigner.getPrice(tokens[i]).then((price) => {
        licenseTokenWithSigner
          .getLicenseTokenInfo(tokens[i])
          .then((licenseTokenInfo) => {
            licenseTokenWithSigner.tokenURI(tokens[i]).then((tokenUri) => {
              const cid = tokenUri.split("ipfs://");
              vm.pintures.push({
                tokenId: tokens[i],
                price: ethers.utils.formatEther(price),
                tokenUri: tokenUri,
                photo: cid[1],
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