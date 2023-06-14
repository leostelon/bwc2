import React, { useEffect, useState } from "react";
import {
	Box,
	CircularProgress,
	Dialog,
	Menu,
	MenuItem,
	Tooltip,
} from "@mui/material";
import { HiOutlineLogout } from "react-icons/hi";
import NoProfilePicture from "../assets/default-profile-icon.png";
import { getShortAddress } from "../utils/addressShort";
import {
	AiOutlineDollarCircle,
	AiOutlineLink,
	AiOutlineShareAlt,
} from "react-icons/ai";

import { toast } from "react-toastify";
import { getUser, updateMasaId } from "../database/user";
import { masa } from "../utils/masa";
import { switchChain } from "../utils/wallet";
import { PrimaryGrey } from "../constants";
import { useRouter } from "next/router";

export const Navbar = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [user, setUser] = useState();

	const router = useRouter();
	const username =
		typeof window === "undefined" ? "" : localStorage.getItem("address");
	const [connectedToSite, setConnectedToSite] = useState(false);

	const [openLoading, setOpenLoading] = useState(false);

	async function gU() {
		const address = localStorage.getItem("address");
		const user = await getUser(address);
		setUser(user);
	}

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleTooltipClose = () => {
		setTooltipOpen(false);
	};

	const handleTooltipOpen = () => {
		setTooltipOpen(true);
	};

	async function connectSite() {
		let token = localStorage.getItem("token");
		if (!token || token === "" || token === "undefined") {
			setConnectedToSite(false);
			return router.push("/welcome");
		}
		setConnectedToSite(true);
	}

	async function linkCeloId() {
		try {
			setOpenLoading(true);
			await switchChain();
			const soulNames = await masa().soulName.loadSoulNames(
				"0xCB171Eb1b9bb01763326d1D842f3b5C6422Fdec9"
			);

			if (soulNames.length > 0) {
				toast(`Linking ${soulNames[0]}.celo to Celinks🌴`, { type: "info" });
				await updateMasaId(soulNames[0]);
				toast(`Succesffuly linked ${soulNames[0]}.celo to Celinks🌴`, {
					type: "success",
				});
			} else {
				toast(`No soul names found for ${getShortAddress(username)}`, {
					type: "warning",
				});
			}
			setOpenLoading(false);
		} catch (error) {
			console.log(error);
			setOpenLoading(false);
		}
	}

	useEffect(() => {
		connectSite();
		gU();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				borderBottom: "1px solid #f5f5f5",
			}}
		>
			<Dialog
				fullWidth
				maxWidth="xs"
				open={openLoading}
				PaperProps={{
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100px",
					}}
				>
					<CircularProgress sx={{ color: "white" }} />
				</Box>
			</Dialog>
			<div className="navbar">
				<div>
					<h1>Celinks🌴</h1>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box mr={3} sx={{ display: "flex", position: "relative" }}>
						<Box
							className="box-icon"
							sx={{
								position: "relative",
								backgroundColor: "rgb(230, 230, 230)",
								padding: "10px !important",
								borderRadius: "6px",
							}}
							onClick={linkCeloId}
						>
							<Box className="box-icon-icon">
								<AiOutlineLink />
							</Box>
							Link .celo
							<Box
								sx={{
									position: "absolute",
									fontSize: "10px",
									padding: "4px",
									borderRadius: "4px",
								}}
								className="colorful"
							>
								new
							</Box>
						</Box>
						<Box className="nav-icon">
							<AiOutlineDollarCircle />
						</Box>
						<Tooltip
							title="Profile link copied!"
							placement="top"
							open={tooltipOpen}
							onClose={handleTooltipClose}
						>
							<Box
								className="nav-icon"
								onClick={() => {
									navigator.clipboard.writeText(username);
									handleTooltipOpen();
								}}
							>
								<AiOutlineShareAlt />
							</Box>
						</Tooltip>
					</Box>
					{!connectedToSite ? (
						<Box onClick={connectSite} className="upload-button">
							Connect Wallet
						</Box>
					) : (
						<Box>
							<Box display="flex" alignItems={"center"}>
								<Box
									sx={{
										backgroundImage: `url("${NoProfilePicture}")`,
										backgroundPosition: "center",
										backgroundRepeat: "no-repeat",
										backgroundSize: "cover",
									}}
									className="profile-icon"
									onClick={handleClick}
								></Box>
								<Box sx={{ fontWeight: "bold", ml: "6px" }}>
									{user && user.masa_id
										? user.masa_id + ".celo"
										: getShortAddress(username)}
								</Box>
							</Box>
							<Menu
								sx={{ top: "4px" }}
								id="basic-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
							>
								<MenuItem
									onClick={() => {
										localStorage.clear();
										window.location.replace("/");
										setAnchorEl(null);
									}}
								>
									<HiOutlineLogout
										color="#828488"
										size={20}
										onClick={() => {
											localStorage.clear();
											window.location.replace("/");
											setAnchorEl(null);
										}}
									/>
									&nbsp;
									<p
										style={{
											fontSize: "14px",
										}}
									>
										Logout
									</p>
								</MenuItem>
								<Box
									sx={{
										fontSize: "10px",
										color: PrimaryGrey,
										textAlign: "center",
									}}
								>
									Names and Avatars
									<br /> powered by{" "}
									<span
										style={{ color: "blue", cursor: "pointer" }}
										onClick={() =>
											window.open("https://masa.finance/", "_blank")
										}
									>
										Masa
									</span>
								</Box>
							</Menu>
						</Box>
					)}
				</div>
			</div>
		</Box>
	);
};
