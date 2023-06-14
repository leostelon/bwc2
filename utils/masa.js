import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers/lib";

export const masa = () => {
    try {
        const provider = new providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
        const signer = provider.getSigner();

        const masa = new Masa({
            signer,
            environment: "production",
            networkName: "celo",
        });
        return masa;
    } catch (error) {
        console.log(error)
    }
}