<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline">Sell Your License</v-card-title>
      <v-card-text>
        <div>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                License
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                Set Price
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Done! </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color=" lighten-1">
                  <v-card-title>
                    <span class="mr-3">Choose a License</span>
                    <v-btn @click="getLicenseTokens"
                      >Get your License NFTs</v-btn
                    ></v-card-title
                  >
                  <div>
                    <v-data-table
                      :headers="headers"
                      :items="licenseTokens"
                      :loading="tableLoading"
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
                          @click="
                            approveToPincture(item.tokenId, item.tokenUri)
                          "
                          :disabled="loading"
                          :loading="loading"
                        >
                          Approve
                        </v-btn>
                      </template>
                    </v-data-table>
                  </div>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color=" lighten-1">
                  <v-card-title> </v-card-title>
                  <v-card-text>
                    <form>
                      <v-text-field
                        v-model="tokenId"
                        :error-messages="tokenIdErrors"
                        label="Picture Token Id"
                        disabled
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="tokenUri"
                        :error-messages="tokenUriErrors"
                        label="Picture Token URI"
                        disabled
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="price"
                        :error-messages="priceErrors"
                        type="number"
                        label="Price"
                        required
                        @change="$v.price.$touch()"
                        @blur="$v.price.$touch()"
                      ></v-text-field>
                      <v-checkbox
                        v-model="checkbox"
                        :error-messages="checkboxErrors"
                        label="Are you sure?"
                        required
                        @change="$v.checkbox.$touch()"
                        @blur="$v.checkbox.$touch()"
                      ></v-checkbox>
                    </form>
                  </v-card-text>
                </v-card>
                <div class="text-right">
                  <v-btn text @click="e1 = 1" class="mr-3">
                    <v-icon>mdi-arrow-left</v-icon>Previous
                  </v-btn>
                  <v-btn color="primary" @click="submit" :loading="loading">
                    Set Price
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title>Well Done</v-card-title>
                  <v-card-text>
                    <div>Now Your license is on Market!</div>
                    <div>
                      Your picture on IPFS:
                      <v-btn :href="tokenUri" target="black" small text>
                        click me
                        <v-icon>mdi-image</v-icon>
                      </v-btn>
                    </div>
                    <div>
                      Your License NFT ID on Smart Contract:
                      <span>{{ licenseTokenId }}</span>
                    </div>
                    <div>
                      Price:
                      <span>{{ price }}</span>
                    </div>
                    <div>
                      Transaction on blockchain:
                      <v-btn
                        :href="`https://kovan.etherscan.io/tx/${txHash}`"
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
import licenseTokenJson from "../assets/contracts/LicenseToken.json";
import pintureJson from "../assets/contracts/Pinture.json";
import { validationMixin } from "vuelidate";
import { required, minValue } from "vuelidate/lib/validators";
export default {
  name: "SellLicenseNFT",
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
        // { text: "Token ID", align: "center", value: "tokenId", width: "10%" },
        { text: "Token URI", align: "center", value: "tokenUri", width: "20%" },
        { text: "Photo", align: "center", value: "photo", width: "40%" },
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "20%"
        }
      ],
      licenseTokens: [],
      tableLoading: false,
      loading: false,

      // form
      tokenId: "",
      tokenUri: "",
      checkbox: false,

      // result
      txHash: "",
      licenseTokenId: "",
      price: 0
    };
  },
  mixins: [validationMixin],

  validations: {
    tokenId: { required },
    tokenUri: { required },
    price: { required, minValue: minValue(1) },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },
    async getLicenseTokens() {
      this.licenseTokens.length = 0;
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      const contractAddress = process.env.VUE_APP_LICENSE_CONTRACT_ADDRESS;
      const abi = licenseTokenJson.abi;

      // The Contract object
      const licenseTokenContract = new ethers.Contract(
        contractAddress,
        abi,
        ethersJsProvider
      );
      const licenseTokenWithSigner = licenseTokenContract.connect(
        ethersJsProvider.getSigner()
      );
      if (this.currentAccount == "") {
        alert("connect metamask first");
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
              console.log(tokenUri);
              const cid = tokenUri.split("ipfs://");
              vm.licenseTokens.push({
                index: index,
                tokenId: tokenId,
                tokenUri: tokenUri,
                photo: cid[1]
              });
            });
            if (index == balance - 1) {
              vm.tableLoading = false;
            }
          });
      }
    },
    async approveToPincture(tokenId, tokenUri) {
      this.tokenId = tokenId;
      this.tokenUri = tokenUri;
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      const contractAddress = process.env.VUE_APP_LICENSE_CONTRACT_ADDRESS;
      const abi = licenseTokenJson.abi;

      // The Contract object
      const licenseTokenContract = new ethers.Contract(
        contractAddress,
        abi,
        ethersJsProvider
      );
      const licenseTokenWithSigner = licenseTokenContract.connect(
        ethersJsProvider.getSigner()
      );
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }

      try {
        this.loading = true;
        console.log(licenseTokenWithSigner);
        const tx = await licenseTokenWithSigner.approve(
          process.env.VUE_APP_PINTURE_CONTRACT_ADDRESS,
          tokenId
        );
        this.txHash = tx.hash;
      } catch (error) {
        this.loading = false;
        console.log(error);
        alert("something error");
        return;
      }

      try {
        const vm = this;
        licenseTokenWithSigner.on(
          "Approval",
          (owner, to, licenseTokenId, event) => {
            vm.loading = false;
            console.log(event);
            this.licenseTokenId = licenseTokenId;
            vm.e1 = 2;
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    async setPrice() {
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      const contractAddress = process.env.VUE_APP_PINTURE_CONTRACT_ADDRESS;
      const abi = pintureJson.abi;

      // The Contract object
      const pintureContract = new ethers.Contract(
        contractAddress,
        abi,
        ethersJsProvider
      );
      const pintureWithSigner = pintureContract.connect(
        ethersJsProvider.getSigner()
      );
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }

      try {
        this.loading = true;
        const tx = await pintureWithSigner.setPrice(this.tokenId, this.price);
        this.txHash = tx.hash;
      } catch (error) {
        this.loading = false;
        console.log(error);
        alert("something error");
        return;
      }

      try {
        const vm = this;
        pintureContract.on(
          "SetPrice",
          (sender, licenseTokenId, price, event) => {
            vm.loading = false;
            console.log(event);
            this.licenseTokenId = licenseTokenId;
            this.price = price;
            vm.e1 = 3;
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    submit() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        // do your submit logic here
        this.setPrice();
        // this.e1 = 3;
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
    },
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    tokenIdErrors() {
      const errors = [];
      if (!this.$v.tokenId.$dirty) return errors;
      !this.$v.tokenId.required && errors.push("Token ID is required");
      return errors;
    },
    tokenUriErrors() {
      const errors = [];
      if (!this.$v.tokenUri.$dirty) return errors;
      !this.$v.tokenUri.required && errors.push("Token Uri is required");
      return errors;
    },
    priceErrors() {
      const errors = [];
      if (!this.$v.price.$dirty) return errors;
      !this.$v.price.minValue && errors.push("Price must be > 0");
      !this.$v.price.required && errors.push("Price is required");
      return errors;
    }
  }
};
</script>