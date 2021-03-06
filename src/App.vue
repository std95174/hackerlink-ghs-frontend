<template>
  <v-app>
    <v-app-bar app color="dark" dark>
      <v-row align="center">
        <v-col cols="4" class="tex-left">
          <h3>Your Address</h3>
          <h5>
            {{
              currentAccount === ""
                ? "Please connect to metamask.."
                : currentAccount
            }}
          </h5>
        </v-col>
        <v-col cols="4" class="text-center">
          <router-link :to="{ name: 'Home' }" class="text-decoration-none" text>
            <span class="mr-2">Pinture</span>
          </router-link>
        </v-col>
        <v-col cols="4" class="text-right">
          <router-link :to="{ name: 'Market' }" class="text-decoration-none">
            <v-btn text>
              <span>{{ "Market 🛒" }}</span>
            </v-btn>
          </router-link>

          <v-btn text @click="connect">
            <span class="mr-2">{{
              currentAccount === "" ? "Connect 🦊" : "Connected 🦊"
            }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import detectEthereumProvider from "@metamask/detect-provider";
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    ...mapActions(["setCurrentAccount"]),
    startApp(provider) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error("Do you have multiple wallets installed?");
      }
      // Access the decentralized web!
    },
    handleChainChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    },
    // For now, 'eth_accounts' will continue to always return an array
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log("Please connect to MetaMask.");
      } else if (accounts[0] !== this.currentAccount) {
        this.$store.dispatch("setCurrentAccount", accounts[0]);
        // Do any other work!
      }
    },
    connect() {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
    }
  },
  async mounted() {
    const provider = await detectEthereumProvider();
    if (provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      this.startApp(provider); // initialize your app
    } else {
      console.log("Please install MetaMask!");
    }

    ethereum.on("chainChanged", this.handleChainChanged);

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on("accountsChanged", this.handleAccountsChanged);
  },
  computed: {
    ...mapGetters(["currentAccount"])
  }
};
</script>

<style scoped>
a:link {
  text-decoration: none;
  color: white;
}

a:visited {
  text-decoration: none;
  color: white;
}

a:hover {
  text-decoration: underline;
}

a:active {
  text-decoration: underline;
}
</style>
