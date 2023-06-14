import { pinJSONToIPFS } from "./nftStorage"
import NFTInterface from "../contracts/NFT.json"
import { CONTRACT_ADDRESS } from "../constants";
import { getWalletAddress, switchChain } from "../utils/wallet";
import { createNFT } from "../database/nft";
import { updateNFT } from "../database/user";

export async function create(name) {
    try {
        if (!window.web3?.eth?.Contract) return;

        const jsonURL = await pinJSONToIPFS(name, "https://bwc-66064efb-bc5b-4ec0-a945-c720a8afab15-f0b25d.spheron.app/Screenshot_129.png");

        await switchChain();
        const contract = new window.web3.eth.Contract(
            NFTInterface.abi,
            CONTRACT_ADDRESS
        );
        const currentAddress = await getWalletAddress();

        // Gas Calculation
        const gasPrice = await window.web3.eth.getGasPrice();
        const gas = await contract.methods
            .mint(jsonURL) // change 2 to price taken from field
            .estimateGas({
                from: currentAddress,
            });

        await contract.methods
            .mint(jsonURL) // change 2 to price taken from field
            .send({ from: currentAddress, gasPrice, gas })
            .on("transactionHash", function (hash) {
                // setStatus(3);
            })
            .on("receipt", async function (receipt) {
                const tokenId = parseInt(receipt.events.Transfer.returnValues.tokenId);
                await createNFT(name, tokenId);
                await updateNFT(tokenId, name)
            });
    } catch (err) {
        console.log(err)
    }
}