import {
	Box,
	CircularProgress,
	Dialog,
	IconButton,
	InputBase,
	Skeleton,
	Switch,
	styled,
} from "@mui/material";

import { MdDeleteOutline, MdOutlineImage } from "react-icons/md";
import {
	AiOutlineArrowsAlt,
	AiOutlinePicture,
	AiOutlinePlus,
} from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { useEffect, useState } from "react";
import AddLink from "../../components/AddLink";
import { Navbar } from "../../components/Navbar";
import { deleteLink, getLinks, updateImage } from "../../database/link";
import {
	getUser,
	updateBackgroundPic,
	updateProfilePic,
} from "../../database/user";
import { toast } from "react-toastify";
import BgImg from "../../assets/background-spheron.png";
import Twitter from "../../assets/twitter.png";
import Phone from "../../assets/phone.png";
import AddPhone from "@/components/AddPhone";
import AddTwitter from "@/components/AddTwitter";

export default function Profile() {
	const [openAddLink, setOpenAddLink] = useState(false);
	const [openAddPhone, setOpenAddPhone] = useState(false);
	const [openAddTwitter, setOpenAddTwitter] = useState(false);
	const [links, setLinks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState();
	const [openLoading, setOpenLoading] = useState(false);
	const actions = [
		{
			title: "Link Phone",
			image: Phone.src,
		},
		{ title: "Link Twitter", image: Twitter.src },
	];

	async function linkExternalclose() {
		setOpenAddLink(false);
		gL();
	}

	async function gU() {
		const address = localStorage.getItem("address");
		const user = await getUser(address);
		setUser(user);
	}

	async function gL() {
		setLoading(true);
		const response = await getLinks();
		setLinks(response);
		setLoading(false);
	}

	useEffect(() => {
		gL();
		gU();
	}, []);

	const updateProfileImage = async (e) => {
		if (e.target.files[0]?.type?.split("/")[0] !== "image")
			toast("Please select a file with type image!");
		else {
			setOpenLoading(true);
			await updateProfilePic(e.target.files[0]);
			await gU();
			setOpenLoading(false);
			toast("Profile Image Updated Successfully!");
		}
	};
	const updateProfileBgImage = async (e) => {
		if (e.target.files[0]?.type?.split("/")[0] !== "image")
			toast("Please select a file with type image!");
		else {
			setOpenLoading(true);
			await updateBackgroundPic(e.target.files[0]);
			await gU();
			setOpenLoading(false);
			toast("Background Image Updated Successfully!");
		}
	};
	const updateLinkImage = async (e, id) => {
		if (e.target.files[0]?.type?.split("/")[0] !== "image")
			toast("Please select a file with type image!");
		else {
			setOpenLoading(true);
			await updateImage(id, e.target.files[0]);
			await gU();
			setOpenLoading(false);
			toast("Background Image Updated Successfully!");
		}
	};

	return (
		<div style={{ position: "relative", backgroundColor: "transparent" }}>
			<Box
				position={"absolute"}
				right={0}
				sx={{
					backgroundImage: `url('${BgImg.src}')`,
					backgroundPosition: "right",
					backgroundRepeat: "no-repeat",
					width: "100vw",
					height: "100vh",
					filter: "brightness(2)",
					zIndex: -1,
				}}
			></Box>
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
			<MainContainer sx={{ padding: { xs: "0 5%", sm: "0 10%", md: "0 20%" } }}>
				<Navbar />
				{openAddLink && (
					<AddLink
						isOpen={openAddLink}
						handleExternalClose={linkExternalclose}
					/>
				)}
				{openAddPhone && (
					<AddPhone
						isOpen={openAddPhone}
						handleExternalClose={() => setOpenAddPhone(false)}
					/>
				)}
				{openAddTwitter && (
					<AddTwitter
						isOpen={openAddTwitter}
						handleExternalClose={() => setOpenAddTwitter(false)}
					/>
				)}
				<Holder>
					<br />
					<h4 style={{ color: "#525252" }}>Powered by Social Connect ✨</h4>
					<br />
					<Box display={"flex"}>
						{actions.map((i, ind) => (
							<Box
								key={ind}
								sx={{
									borderRadius: "12px",
									p: 2,
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "space-between",
									height: "100px",
									width: "120px",
									mx: 1,
									ml: ind === 0 ? 0 : 1,
									cursor: "pointer",
									border: `3px solid transparent`,
									backgroundColor: "#e9e9e95d",
									"&:hover": {
										backgroundColor: "#e9e9e933",
										border: `3px solid #5292ff`,
									},
								}}
								onClick={() => {
									if (ind === 0) {
										setOpenAddPhone(true);
									} else if (ind === 1) {
										setOpenAddTwitter(true);
									}
								}}
							>
								<Box
									sx={{
										flex: 2,
										backgroundImage: `url("${i.image}")`,
										backgroundPosition: "center",
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
										minHeight: "60px",
									}}
								></Box>
								<Box
									sx={{
										display: "flex",
										alignItems: "flex-end",
										justifyContent: "center",
										textAlign: "center",
										flex: 1,
										fontSize: "12px",
										fontWeight: "600",
									}}
								>
									<p>{i.title}</p>
								</Box>
							</Box>
						))}
					</Box>
					<br />
					<h4 style={{ color: "#525252" }}>Actions ⚒️</h4>
					<Box
						sx={{
							display: "flex",
							width: "100%",
							justifyContent: "space-between",
							alignItems: "center",
							m: "12px 0px",
						}}
					>
						<Box display="flex">
							<IconButton
								sx={{
									borderRadius: "6px",
									marginRight: "4px",
								}}
								component="label"
								onChange={updateProfileImage}
							>
								<Box className="box-icon">
									<Box className="box-icon-icon">
										<BsPerson />
									</Box>
									Profile Image
								</Box>
								<input type="file" hidden />
							</IconButton>
							<IconButton
								sx={{
									borderRadius: "6px",
									marginRight: "4px",
								}}
								component="label"
								onChange={updateProfileBgImage}
							>
								<Box className="box-icon">
									<Box className="box-icon-icon">
										<AiOutlinePicture />
									</Box>
									Background
								</Box>
								<input type="file" hidden />
							</IconButton>

							<Box
								className="box-icon box-icon-hover"
								onClick={() => {
									setOpenAddLink(true);
								}}
								sx={{ padding: "0 8px!important" }}
							>
								<Box className="box-icon-icon">
									<AiOutlinePlus />
								</Box>
								Add Link
							</Box>
						</Box>
						<Box
							className="box-icon box-icon-hover"
							onClick={() => window.open(`/${user ? user.celo_id : ""}`)}
							sx={{ padding: "10px!important" }}
						>
							<Box className="box-icon-icon">
								<AiOutlineArrowsAlt />
							</Box>
							Preview
						</Box>
					</Box>
					<h4 style={{ color: "#525252" }}>Links 📃</h4>
					<br />
					{loading
						? Array.from({ length: 5 }).map((_, i) => (
								<Skeleton
									variant="rectangular"
									sx={{ my: 1, borderRadius: "8px" }}
									height={"125px"}
									key={i}
								/>
						  ))
						: links.map((a, i) => (
								<LinkCont key={i}>
									<LinkDescription>
										<Box sx={{ paddingLeft: "10px" }}>
											<Box>
												<InputBase
													sx={{
														fontSize: "16px",
														fontWeight: "bold",
													}}
													value={a.data.title}
													inputProps={{
														"aria-label": "Twitter",
													}}
												/>
											</Box>
											<Box sx={{ fontSize: "16px" }}>
												<InputBase
													sx={{
														fontSize: "16px",
														width: "100%",
													}}
													value={a.data.url}
													inputProps={{
														"aria-label": "Twitter",
													}}
												/>
											</Box>
										</Box>
										<Box>{/* <IOSSwitch defaultChecked /> */}</Box>
									</LinkDescription>
									<LinkDescription>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<IconButton
												onChange={(e) => updateLinkImage(e, a.data.id)}
												component="label"
											>
												<MdOutlineImage />
												<input type="file" hidden />
											</IconButton>
											<Box>{a.data.clicks} clicks</Box>
										</Box>
										<Box>
											<IconButton
												aria-label="delete"
												onClick={async () => {
													await deleteLink(a.data.id);
													gL();
												}}
											>
												<MdDeleteOutline />
											</IconButton>
										</Box>
									</LinkDescription>
								</LinkCont>
						  ))}
				</Holder>
			</MainContainer>
			{openAddLink && (
				<AddLink isOpen={openAddLink} handleExternalClose={linkExternalclose} />
			)}
		</div>
	);
}

const MainContainer = styled(Box)({
	backgroundColor: "black",
	backgroundColor: "transparent",
	width: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	minHeight: "100vh",
});

const Holder = styled(Box)({
	maxWidth: "990px",
	"@media only screen and (max-width: 400px)": {
		width: "99%",
	},

	//   padding: "20px",

	"@media only screen and (max-width: 335px)": {
		padding: "5px",
	},
});

const LinkCont = styled(Box)({
	width: "100%",
	height: "140px",
	backgroundColor: "#ffffff",

	borderRadius: "20px",
	padding: "20px",

	marginBottom: "16px",
	boxShadow: "0 1px 3px 0 rgba(106, 106, 106, 0.2)",
});
const LinkDescription = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	flexWrap: "wrap",
});

const IOSSwitch = styled((props) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color:
				theme.palette.mode === "light"
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 22,
		height: 22,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));
