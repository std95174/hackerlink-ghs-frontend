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
                    <v-btn @click="getPictureTokens"
                      >Get your Picture NFTs</v-btn
                    ></v-card-title
                  >
                  <v-card-text>
                    <span
                      >Get and Choose picture that you want to make
                      licenses</span
                    >
                    <v-data-table
                      :headers="headers"
                      :items="pintureTokens"
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
                          @click="choosePictureToken(item.tokenId)"
                        >
                          Continue
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color=" lighten-1">
                  <v-card-title> Config Your License </v-card-title>
                  <v-card-text>
                    <form>
                      <a @click="to = currentAccount"
                        >Click and Paste your address</a
                      >
                      <v-text-field
                        v-model="to"
                        :error-messages="toErrors"
                        :counter="42"
                        label="Address You Want To Authorize"
                        required
                        @input="$v.to.$touch()"
                        @blur="$v.to.$touch()"
                      ></v-text-field>
                      <v-text-field
                        v-model="tokenId"
                        :error-messages="tokenIdErrors"
                        label="Picture Token Id"
                        disabled
                        required
                      ></v-text-field>
                      <v-row>
                        <v-col cols="8">
                          <v-file-input
                            @change="setPhoto"
                            label="Actual size picture that you want to authorize"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="4">
                          <v-btn
                            color="primary"
                            @click="uploadToIPFS"
                            :loading="uploadLoading"
                          >
                            Upload
                          </v-btn>
                        </v-col>
                      </v-row>

                      <v-text-field
                        v-model="tokenUri"
                        :error-messages="tokenUriErrors"
                        label="License Token URI"
                        disabled
                        required
                      ></v-text-field>
                      <v-menu
                        v-model="startTimeMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="startTime"
                            :error-messages="startTimeErrors"
                            label="Click to Pick Start Time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="$v.startTime.$touch()"
                            @blur="$v.startTime.$touch()"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="startTime"
                          @input="startTimeMenu = false"
                        ></v-date-picker>
                      </v-menu>
                      <v-menu
                        v-model="endTimeMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endTime"
                            :error-messages="endTimeErrors"
                            label="Click to Pick End Time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="$v.endTime.$touch()"
                            @blur="$v.endTime.$touch()"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="endTime"
                          @input="endTimeMenu = false"
                        ></v-date-picker>
                      </v-menu>
                      <v-text-field
                        v-model="quantity"
                        :error-messages="quantityErrors"
                        type="number"
                        label="Quantity"
                        required
                        @change="$v.quantity.$touch()"
                        @blur="$v.quantity.$touch()"
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
                    Mint
                  </v-btn>
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
                        :href="`http://ipfs.infura.io:5001/api/v0/cat?arg=${tokenUri}`"
                        target="black"
                        small
                        text
                      >
                        click me
                        <v-icon>mdi-image</v-icon>
                      </v-btn>
                    </div>
                    <div>
                      Your License NFT ID on Smart Contract:
                      <span>{{ licenseTokenId }}</span>
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
import axios from "axios";
import { mapGetters } from "vuex";
import {
  pictureTokenWithSigner,
  licenseTokenWithSigner
} from "@/common/contract";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  minValue
} from "vuelidate/lib/validators";
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
      pintureTokens: [],
      tableLoading: false,
      loading: false,
      uploadLoading: false,

      // form
      to: "",
      tokenId: "",
      tokenUri: "",
      quantity: 0,
      checkbox: false,
      startTime: "",
      endTime: "",
      startTimeMenu: false,
      endTimeMenu: false,

      // ipfs
      photo: null,

      // result
      txHash: "",
      licenseTokenId: ""
    };
  },
  mixins: [validationMixin],

  validations: {
    to: { required, maxLength: maxLength(42), minLength: minLength(42) },
    tokenId: { required },
    tokenUri: { required },
    quantity: { required, minValue: minValue(1) },
    startTime: { required },
    endTime: { required },
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
    async getPictureTokens() {
      this.pintureTokens.length = 0;

      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }
      const balance = await pictureTokenWithSigner.balanceOf(
        this.currentAccount
      );
      const vm = this;
      this.tableLoading = true;
      console.log(this.currentAccount);

      for (let index = 0; index < balance; index++) {
        pictureTokenWithSigner
          .tokenOfOwnerByIndex(this.currentAccount, index)
          .then((tokenId) => {
            pictureTokenWithSigner.tokenURI(tokenId).then((tokenUri) => {
              const photo = tokenUri.split("ipfs://");
              vm.pintureTokens.push({
                index: index,
                tokenId: tokenId,
                tokenUri: tokenUri,
                photo: photo[1]
              });
            });
            if (index == balance - 1) {
              vm.tableLoading = false;
            }
          });
      }
    },
    choosePictureToken(tokenId) {
      this.tokenId = tokenId._hex;
      this.e1 = 2;
    },
    setPhoto(event) {
      this.photo = event;
      console.log(this.photo);
    },
    uploadToIPFS() {
      this.uploadLoading = true;
      let formData = new FormData();
      formData.append("Photo", this.photo);
      const vm = this;
      axios
        .post("https://ipfs.infura.io:5001/api/v0/add", formData)
        .then((res) => {
          vm.uploadLoading = false;
          vm.tokenUri = res.data.Hash;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit() {
      console.log("submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        // do your submit logic here
        this.mintLicenseNFT();
        // this.e1 = 3;
      }
    },
    async mintLicenseNFT() {
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }

      try {
        const cid = this.tokenUri;
        this.loading = true;
        const tx = await licenseTokenWithSigner.safeMint(
          this.to,
          this.tokenId,
          new Date(this.startTime).getTime(),
          new Date(this.endTime).getTime(),
          this.quantity,
          cid,
          Math.floor(Math.random() * 4294967296)
        );
        this.txHash = tx.hash;
      } catch (error) {
        alert("cid duplicated");
        this.loading = true;
      }

      try {
        const vm = this;
        licenseTokenWithSigner.on(
          "Mint",
          (
            to,
            pictureTokenId,
            licenseTokenId,
            startTime,
            endTime,
            quantity,
            randomNum,
            event
          ) => {
            vm.loading = false;
            console.log(event);
            this.licenseTokenId = licenseTokenId;
            vm.e1 = 3;
          }
        );
      } catch (error) {
        console.log(error);
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
    toErrors() {
      const errors = [];
      if (!this.$v.to.$dirty) return errors;
      !this.$v.to.maxLength &&
        errors.push("Address must be 42 characters and with 0x prefix");
      !this.$v.to.minLength &&
        errors.push("Address must be 42 characters and with 0x prefix");
      !this.$v.to.required && errors.push("Address is required.");
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
    quantityErrors() {
      const errors = [];
      if (!this.$v.quantity.$dirty) return errors;
      !this.$v.quantity.minValue && errors.push("Quantity must be > 0");
      !this.$v.quantity.required && errors.push("Quantity is required");
      return errors;
    },
    startTimeErrors() {
      const errors = [];
      if (!this.$v.startTime.$dirty) return errors;
      !this.$v.startTime.required && errors.push("Start Time is required");
      return errors;
    },
    endTimeErrors() {
      const errors = [];
      if (!this.$v.endTime.$dirty) return errors;
      !this.$v.endTime.required && errors.push("End Time is required");
      return errors;
    }
  }
};
</script>