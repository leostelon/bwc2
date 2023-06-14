const { db } = require(".");
const jwt = require("jsonwebtoken");
const { getWalletAddress } = require("../utils/wallet");
const { pinFileToIPFS } = require("../pages/api/nftStorage");

const collectionReference = db.collection("User");

export const createToken = async function (address) {
	try {
		await window.ethereum.request({
			method: "personal_sign",
			params: [address, "Please approve this message."],
		});

		const payload = {
			wallet_address: address,
		};
		const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET, {
			expiresIn: "60 days",
		});
		await collectionReference.record(address).call("updateToken", [token]);

		return token;
	} catch (error) {
		console.log(error.message);
	}
};

export const createUser = async function (address) {
	try {
		let user;
		try {
			user = await collectionReference.record(address).get();
		} catch (err) {}

		if (!user?.data?.id) {
			await collectionReference.create([address]);
		}

		const token = await createToken(address);
		localStorage.setItem("token", token);
		return token;
	} catch (error) {
		console.log(error.message);
	}
};

export const getUser = async function (address) {
	try {
		let user;
		try {
			user = await collectionReference.record(address).get();
		} catch (err) {}
		return user.data;
	} catch (error) {
		console.log(error.message);
	}
};

export const updateProfilePic = async function (file) {
	try {
		// Upload thumbnail
		const imageResponse = await pinFileToIPFS(file);

		const userAddress = await getWalletAddress();
		const response = await collectionReference
			.record(userAddress)
			.call("updateProfileImage", [imageResponse]);
		return response.data;
	} catch (error) {
		console.log(error.message);
	}
};

export const updateBackgroundPic = async function (file) {
	try {
		// Upload thumbnail
		const imageResponse = await pinFileToIPFS(file);

		const userAddress = await getWalletAddress();
		const response = await collectionReference
			.record(userAddress)
			.call("updateBackgroundImage", [imageResponse]);
		return response.data;
	} catch (error) {
		console.log(error.message);
	}
};

export const updateNFT = async function (tokenId, celo_id) {
	try {
		const userAddress = await getWalletAddress();
		const response = await collectionReference
			.record(userAddress)
			.call("updateNFT", [tokenId, celo_id]);
		return response.data;
	} catch (error) {
		console.log(error.message);
	}
};

export const updateMasaId = async function (masa_id) {
	try {
		const userAddress = await getWalletAddress();
		const response = await collectionReference
			.record(userAddress)
			.call("updateMasaId", [masa_id]);
		return response.data;
	} catch (error) {
		console.log(error.message);
	}
};
