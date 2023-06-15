import { Box, CircularProgress, InputBase } from "@mui/material";
import React, { useEffect, useState } from "react";
import { create } from "./api/contract";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import { createUser, getUser } from "../database/user";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Main() {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [connectedToSite, setConnectedToSite] = useState(false);
	const router = useRouter()

	async function createNFT() {
		if (!name || name === "") return toast("Enter your unique Celo ID");
		setLoading(true);
		await create(name);
		await checkCeloId();
		toast("Successfully created a CELO ID🥳", { type: "success" });
		setName("");
		setLoading(false);
	}

	async function connectSite() {
		await connectWalletToSite();
		const address = await getWalletAddress();
		if (address && address !== "") {
			let token = localStorage.getItem("token");
			localStorage.setItem("address", address);
			if (!token || token === "" || token === "undefined") {
				await createUser(address);
			}
			token = localStorage.getItem("token");
			if (token && token !== "" && token !== "undefined") {
				setConnectedToSite(true);
				checkCeloId();
			}
		}
	}

	async function checkCeloId() {
		const address = await getWalletAddress();
		const user = await getUser(address);
		console.log(user);
		if (user && user.celo_id && user.celo_id !== "") {
			router.push("/profile");
		}
	}

	useEffect(() => {
		connectSite();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Box sx={{ height: "100vh", width: "100vw", backgroundColor: "#502274" }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						color: "#e9c0e9",
						py: 6,
						px: "15vw",
						fontSize: "55px",
						fontWeight: "900",
						textAlign: "center",
					}}
				>
					Jumpstart Your corner of the internet today
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box sx={{ mr: 2 }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								fontSize: "20px",
								backgroundColor: "white",
								padding: "20px",
								borderRadius: "10px",
							}}
						>
							<Box>cellinks.xyz/</Box>
							<Box sx={{ paddingTop: "3px" }}>
								<InputBase
									type="text"
									placeholder="yourname"
									style={{
										fontSize: "19px",
									}}
									onChange={(e) => {
										setName(e.target.value);
									}}
									value={name}
								/>
							</Box>
						</Box>
					</Box>
					<Box>
						<button
							style={{
								padding: loading ? "10px" : "20px",
								fontSize: "20px",
								fontWeight: "500",
								border: "none",
								borderRadius: "50px",
								minWidth: "150px",
								backgroundColor: "#d2e823",
								cursor: "pointer",
							}}
							onClick={createNFT}
						>
							{loading ? (
								<CircularProgress sx={{ color: "white" }} size={32} />
							) : connectedToSite ? (
								"Claim your Cellink"
							) : (
								"Connect Wallet"
							)}
						</button>
					</Box>
				</Box>
				<Box
					sx={{
						mx: "5vw",
						mt: 10,
						backgroundColor: "#e9c0e9",
						position: "absolute",
						bottom: 0,
						height: "300px",
						width: "90%",
						borderTopLeftRadius: "60px",
						borderTopRightRadius: "60px",
					}}
				>
					<Box
						sx={{
							fontSize: "140px",
							fontWeight: "700",
							textAlign: "center",
							display: "flex",
							justifyContent: "center",
							alignItems: "flex-end",
							color: "#502274",
							height: "100%",
							pb: 3,
						}}
					>
						Cellinks*
					</Box>
				</Box>
			</Box>
		</div>
	);
}
