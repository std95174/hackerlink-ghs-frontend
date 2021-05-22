<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline">Make Your Picture NFT</v-card-title>
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
                  <v-card-title>Upload Your Picture to IPFS</v-card-title>
                  <v-card-text>
                    <span
                      >You can upload the sample picture here, and upload real
                      picture to make License later.</span
                    >
                    <v-file-input @change="setPhoto"></v-file-input>
                  </v-card-text>
                </v-card>
                <div class="text-right">
                  <v-btn
                    color="primary"
                    @click="uploadToIPFS"
                    :loading="uploadLoading"
                  >
                    Upload
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title> Make a NFT </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="cid"
                      label="CIDv0"
                      disabled
                      required
                    ></v-text-field>
                  </v-card-text>
                </v-card>
                <div class="text-right">
                  <v-btn text @click="e1 = 1" class="mr-3">
                    <v-icon>mdi-arrow-left</v-icon>Previous
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="mintPintureNFT"
                    :loading="uploadLoading"
                  >
                    Mint
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12" color=" lighten-1" height="200px">
                  <v-card-title>Well Done</v-card-title>
                  <v-card-text>
                    <div>
                      It's great that you make you photo a NFT. Now, time to
                      make a its license NFT and make some money!
                    </div>
                    <div>
                      Your picture on IPFS:
                      <v-btn
                        :href="`http://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`"
                        target="black"
                        small
                        text
                      >
                        click me
                        <v-icon>mdi-image</v-icon>
                      </v-btn>
                    </div>
                    <div>
                      Your NFT ID on Smart Contract: <span>{{ tokenId }}</span>
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
        <!-- <v-btn color="red darken-1" text >確定</v-btn> -->
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import { pictureTokenWithSigner } from "@/common/contract";
import axios from "axios";
export default {
  name: "PictureNFT",
  props: {
    value: Boolean
  },
  data() {
    return {
      e1: 1,
      photo: null,
      cid: "",
      uploadLoading: false,
      txHash: "",
      tokenId: 0
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {});
    },
    setPhoto(event) {
      this.photo = event;
      console.log(this.photo);
    },
    uploadToIPFS() {
      this.uploadLoading = true;
      let formData = new FormData();
      formData.append("Photo", this.photo);
      axios
        .post("https://ipfs.infura.io:5001/api/v0/add", formData)
        .then((res) => {
          this.uploadLoading = false;
          this.cid = res.data.Hash;
          this.e1 = 2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async mintPintureNFT() {
      if (this.currentAccount == "") {
        alert("connect metamask first");
        return;
      }

      try {
        this.uploadLoading = true;
        const tx = await pictureTokenWithSigner.safeMint(
          this.currentAccount,
          this.cid
        );
        this.txHash = tx.hash;
      } catch (error) {
        alert("cid duplicated");
        this.uploadLoading = false;
      }

      try {
        const vm = this;
        pictureTokenWithSigner.on("Transfer", (to, tokenId, cid, event) => {
          vm.uploadLoading = false;
          this.tokenId = event.args.tokenId._hex;
          vm.e1 = 3;
        });
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
    }
  },
  created() {}
};
</script>