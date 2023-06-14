import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers/lib";

export const masa = () => {
    
    if (!window.ethereum) return;

    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const masa = new Masa({
        signer,
        environment: "production",
        networkName: "celo",
    });
    return masa;
}