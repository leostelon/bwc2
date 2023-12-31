import axios from "axios";

const baseURL = "https://api.nft.storage";

export async function pinFileToIPFS(file) {
	try {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		const ipfsFile = await axios.post(baseURL + "/upload", formData, {
			headers: {
				"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFTSTORAGE_KEY}`,
			},
		});
		const data = ipfsFile.data.value;
		const assetUrl = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}/${data.cid}/${data.files[0].name}`;
		return assetUrl;
	} catch (error) {
		console.log(error);
	}
}

export async function pinJSONToIPFS(name, assetUrl) {
	try {
		const content = {
			name: name,
			description: `${name}, a Celo naming solution.`,
			image: assetUrl,
		};
		const jsonIpfs = await axios.post(baseURL + "/upload", content, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFTSTORAGE_KEY}`,
			},
		});
		const url = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}/${jsonIpfs.data.value.cid}`;

		return url;
	} catch (error) {
		console.log(error);
	}
}
