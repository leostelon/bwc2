const { db } = require(".");

const collectionReference = db.collection("NFT");

export async function createNFT(name, tokenId) {
    try {
        const address = localStorage.getItem("address");

        const response = await collectionReference.create([
            name, tokenId, address
        ]);

        return response;
    } catch (err) {
        console.log(err.message)
    }
}