<template>
  <div class="home">
    <div>Your handsome account: {{ currentAccount }}</div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import detectEthereumProvider from "@metamask/detect-provider";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data() {
    return {
      currentAccount: "unconnected yet"
    };
  },
  methods: {
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
        this.currentAccount = accounts[0];
        // Do any other work!
      }
    },
    // While you are awaiting the call to eth_requestAccounts, you should disable
    // any buttons the user can click to initiate the request.
    // MetaMask will reject any additional requests while the first is still
    // pending.
    connect() {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
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
    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    const chainId = await ethereum.request({ method: "eth_chainId" });
    console.log(chainId);
    // this.handleChainChanged(chainId);

    ethereum.on("chainChanged", this.handleChainChanged);

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(this.handleAccountsChanged)
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on("accountsChanged", this.handleAccountsChanged);

    /*********************************************/
    /* Access the user's accounts (per EIP-1102) */
    /*********************************************/

    // You should only attempt to request the user's accounts in response to user
    // interaction, such as a button click.
    // Otherwise, you popup-spam the user like it's 1999.
    // If you fail to retrieve the user's account(s), you should encourage the user
    // to initiate the attempt.
    document.getElementById("connectButton", this.connect);
  },
  async created() {}
};
</script>
