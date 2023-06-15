import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers/lib";

const provider = new providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
const signer = provider.getSigner();

export const masa = new Masa({
    signer,
    environment: "production",
    networkName: "alfajores",
});

export async function createSoulName() {
    try {
        // const response = await masa.soulName.create("CELO", "hariprasana", 2, "0xCB171Eb1b9bb01763326d1D842f3b5C6422Fdec9")
        const response = await masa.identity.createWithSoulName("CELO", "hariprasana", 2, "0xCB171Eb1b9bb01763326d1D842f3b5C6422Fdec9")
        console.log(response)
    } catch (error) {

    }
}