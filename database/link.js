import { pinFileToIPFS } from "../api/nftStorage";

const { db } = require(".");

const collectionReference = db.collection("Link");
const userReference = db.collection("User");

export async function createLink(url, title) {
	try {
		const address = localStorage.getItem("address");

		const response = await collectionReference.create([url, title, address]);

		return response.data;
	} catch (err) {
		console.log(err.message);
	}
}

export async function getLinks() {
	try {
		const address = localStorage.getItem("address");

		const response = await collectionReference
			.where("user", "==", address)
			.sort("timestamp", "desc")
			.get();

		return response.data;
	} catch (err) {
		console.log(err.message);
	}
}

export async function getLink(id) {
	try {
		const response = await collectionReference
			.record(id)
			.call("incrementClick", [])
			.get();
		return response.data;
	} catch (err) {
		console.log(err.message);
	}
}

export async function getLinksWithId(celo_id) {
	try {
		celo_id = celo_id.replace(".celo", "");
		let response = await userReference.where("masa_id", "==", celo_id).get();
		if (response.data.length === 0) {
			response = await userReference.where("celo_id", "==", celo_id).get();
		}
		const links = await collectionReference
			.where("user", "==", response.data[0].data.id)
			.sort("timestamp", "desc")
			.get();

		return { user: response.data[0].data, links: links.data };
	} catch (err) {
		console.log(err.message);
	}
}

export async function updateImage(id, image) {
	try {
		const imageUrl = await pinFileToIPFS(image);
		const response = await collectionReference
			.record(id)
			.call("updateImage", [imageUrl]);

		return response;
	} catch (err) {
		console.log(err.message);
	}
}

export async function updateUrl(id, url) {
	try {
		const response = await collectionReference
			.record(id)
			.call("updateURL", [url]);

		return response;
	} catch (err) {
		console.log(err.message);
	}
}

export async function updateTitle(id, title) {
	try {
		const response = await collectionReference
			.record(id)
			.call("updateTitle", [title]);

		return response;
	} catch (err) {
		console.log(err.message);
	}
}

export async function deleteLink(linkId) {
	try {
		const response = await collectionReference.record(linkId).call("del", []);

		return response;
	} catch (err) {
		console.log(err.message);
	}
}
