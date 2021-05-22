import { ethers } from "ethers";
import licenseTokenJson from "@/assets/contracts/LicenseToken.json";
import pictureTokenJson from "@/assets/contracts/PictureToken.json";
import pintureJson from "@/assets/contracts/Pinture.json";

const ethersJsProvider = new ethers.providers.Web3Provider(window.ethereum);

// license
export const licenseTokenContract = new ethers.Contract(
    process.env.VUE_APP_LICENSE_CONTRACT_ADDRESS,
    licenseTokenJson.abi,
    ethersJsProvider
);

export const licenseTokenWithSigner = licenseTokenContract.connect(
    ethersJsProvider.getSigner()
);

// picture
export const pictureTokenContract = new ethers.Contract(
    process.env.VUE_APP_PICTURE_CONTRACT_ADDRESS,
    pictureTokenJson.abi,
    ethersJsProvider
);
export const pictureTokenWithSigner = pictureTokenContract.connect(
    ethersJsProvider.getSigner()
);

// pinture
export const pintureContract = new ethers.Contract(
    process.env.VUE_APP_PINTURE_CONTRACT_ADDRESS,
    pintureJson.abi,
    ethersJsProvider
);
export const pintureWithSigner = pintureContract.connect(
    ethersJsProvider.getSigner()
);