<template>
  <v-parallax
    src="https://images.unsplash.com/photo-1447710441604-5bdc41bc6517?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
    style="height: 100vh"
  >
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <v-slide-y-transition>
          <div v-show="show">
            <h1 class="display-1 font-weight-thin mb-4">Pinture</h1>
            <h3 class="subheading">
              Pinture is a service that make creators license their picture
              easily.
            </h3>
          </div>
        </v-slide-y-transition>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="text-right">
        <v-btn @click="photoNFTDialog = true">📷 Make Your Picture NFT </v-btn>
      </v-col>
      <v-col class="text-center"
        ><v-btn @click="licenseNFTDialog = true"
          >Make Your License NFT 🔐</v-btn
        >
      </v-col>
      <v-col class="text-left"
        ><v-btn @click="sellLicenseNFTDialog = true"
          >Sell Your License 🛒</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mr-6 ml-6 pa-6">
      <v-col>
        <span>
          <span class="ml-6"> Licensing</span> photo have always been a pain for
          image creators. The existing photo authorization services are
          restricted by the platform itself, and the pricing is controlled by
          the platform. The creators have no right to set the price for
          themselves. Moreover, the legal issues of image copyright are
          complicated, which makes it difficult to authorize on the Internet.
          The emergence of NFT makes it possible to transfer the ownership of
          digital assets. Numerous artworks, music, and images have found new
          life. Creators can free themselves to create without being restricted
          by physical properties. However, NFTs currently focus on The transfer
          of ownership, we believe that the right to use also has a lot of room
          for development, for example, the right to printing and the right to
          editorial. Traditionally, it has been monopolized by major platforms,
          and the emergence of NFT can break the deadlock. We hope to maximize
          the transfer of rights and use blockchain technology to create a open
          platform for creators.
        </span>
      </v-col>
    </v-row>
    <picture-nft v-model="photoNFTDialog"></picture-nft>
    <license-nft v-model="licenseNFTDialog"></license-nft>
    <sell-license-nft v-model="sellLicenseNFTDialog"></sell-license-nft>
  </v-parallax>
</template>

<script>
// @ is an alias to /src
import PictureNFT from "@/components/PictureNFT.vue";
import LicenseNFT from "@/components/LicenseNFT.vue";
import SellLicenseNFT from "@/components/SellLicenseNFT.vue";

export default {
  name: "Home",
  components: {
    "picture-nft": PictureNFT,
    "license-nft": LicenseNFT,
    "sell-license-nft": SellLicenseNFT
  },
  data() {
    return {
      currentAccount: "unconnected yet",
      photoNFTDialog: false,
      licenseNFTDialog: false,
      sellLicenseNFTDialog: false,
      show: false
    };
  },
  methods: {},
  async mounted() {},
  async created() {
    const vm = this;
    setTimeout(function () {
      vm.show = true;
    }, 500);
  }
};
</script>

<style scoped>
</style>