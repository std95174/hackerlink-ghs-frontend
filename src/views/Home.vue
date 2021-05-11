<template>
  <v-parallax
    src="https://images.unsplash.com/photo-1447710441604-5bdc41bc6517?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
    style="height: 100vh"
  >
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="display-1 font-weight-thin mb-4">Pinture</h1>
        <h3 class="subheading">
          Pinture is a service that make creators license their picture easily.
        </h3>
      </v-col>
    </v-row>
    <v-row class="mr-6 ml-6 pa-6">
      <v-col>
        <span>
          Licensing photo have always been a pain for image creators. The
          existing photo authorization services are restricted by the platform
          itself, and the pricing is controlled by the platform. The creators
          have no right to set the price for themselves. Moreover, the legal
          issues of image copyright are complicated, which makes it difficult to
          authorize on the Internet. The emergence of NFT makes it possible to
          transfer the ownership of digital assets. Numerous artworks, music,
          and images have found new life. Creators can free themselves to create
          without being restricted by physical properties. However, NFTs
          currently focus on The transfer of ownership, we believe that the
          right to use also has a lot of room for development, for example, the
          right to printing and the right to editorial. Traditionally, it has
          been monopolized by major platforms, and the emergence of NFT can
          break the deadlock. We hope to maximize the transfer of rights and use
          blockchain technology to create a open platform for creators.
        </span>
      </v-col>
    </v-row>
    <!-- <div>Your handsome account: {{ currentAccount }}</div>
    <v-btn color="blue" @click="sendETH">Send 1 ETH to Frank</v-btn>
    <v-btn color="red" @click="callContract"
      >Frank upload something to PhotoToken contract</v-btn
    >
    <v-btn color="red" @click="getBalance"
      >Frank get balance from PhotoToken contract</v-btn
    > -->
  </v-parallax>
</template>

<script>
// @ is an alias to /src
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import PhotoTokenJson from "../assets/contracts/PhotoToken.json";

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
    },
    sendETH() {
      const vm = this;
      ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: vm.currentAccount,
            to: vm.currentAccount,
            value: "0xDE0B6B3A7640000"
          }
        ]
      });
    },
    async callContract() {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what Metamask injects as window.ethereum into each page
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      // You can also use an ENS name for the contract address
      const PhotoTokenContractAddress =
        "0xf9a796ae51527dbc22ef28841c7f625cee732bb9";

      // The ERC-20 Contract ABI, which is a common contract interface
      // for tokens (this is the Human-Readable ABI format)
      const PhotoTokenAbi = PhotoTokenJson.abi;

      // The Contract object
      const PhotoTokenContract = new ethers.Contract(
        PhotoTokenContractAddress,
        PhotoTokenAbi,
        ethersJsProvider
      );

      // The DAI Contract is currently connected to the Provider,
      // which is read-only. You need to connect to a Signer, so
      // that you can pay to send state-changing transactions.
      const PhotoTokenWithSigner = PhotoTokenContract.connect(
        ethersJsProvider.getSigner()
      );

      // Send 1 DAI to "ricmoo.firefly.eth"
      const tx = await PhotoTokenWithSigner.safeMint(
        this.currentAccount,
        1,
        "ipfs://QmGGG"
      );
      console.log(tx);

      // Receive an event when ANY transfer occurs
      PhotoTokenWithSigner.on("Mint", (event) => {
        console.log(event);
        // The event object contains the verbatim log data, the
        // EventFragment and functions to fetch the block,
        // transaction and receipt and event functions
      });
    },
    async getBalance() {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what Metamask injects as window.ethereum into each page
      const ethersJsProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      // You can also use an ENS name for the contract address
      const PhotoTokenContractAddress =
        "0xf9a796ae51527dbc22ef28841c7f625cee732bb9";

      // The ERC-20 Contract ABI, which is a common contract interface
      // for tokens (this is the Human-Readable ABI format)
      const PhotoTokenAbi = PhotoTokenJson.abi;

      // The Contract object
      const PhotoTokenContract = new ethers.Contract(
        PhotoTokenContractAddress,
        PhotoTokenAbi,
        ethersJsProvider
      );

      // The DAI Contract is currently connected to the Provider,
      // which is read-only. You need to connect to a Signer, so
      // that you can pay to send state-changing transactions.
      const PhotoTokenWithSigner = PhotoTokenContract.connect(
        ethersJsProvider.getSigner()
      );
      console.log(await PhotoTokenWithSigner.balanceOf(this.currentAccount));
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

<style scoped>
</style>