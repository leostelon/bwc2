import { Box, IconButton, Skeleton, styled as muiStyled } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLink, getLinksWithId } from "../database/link";
import { AiFillDollarCircle, AiOutlineShareAlt } from "react-icons/ai";
import NoProfilePicture from "../assets/default-profile-icon.png";
import ValoQr from "@/components/ValoQr";

export default function Home() {
	const router = useRouter();
	const { id } = router.query;
	const [links, setLinks] = useState([]);
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);

	const [isOpenQR, setIsOpenQR] = useState(false);

	async function gLWId(id) {
		try {
			setLoading(true);
			const { user, links } = await getLinksWithId(id);
			setUser(user);
			setLinks(links);
			console.log(user);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	useEffect(() => {
		if (id) gLWId(id);
	}, [id]);

	return (
		<div>
			<MainContainer
				style={
					user?.bg_image
						? {
								backgroundImage: `url(${user?.bg_image})`,
						  }
						: {}
				}
			>
				{!loading && (
					<Box
						sx={{
							height: "100px",
							width: "100px",
							mt: 8,
						}}
						style={{
							backgroundImage: user?.profile_image
								? `url(${user?.profile_image})`
								: NoProfilePicture.src,
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							borderRadius: "50px",
						}}
					></Box>
				)}
				{!loading && (
					<Box
						sx={{
							pt: 3,
							fontSize: "20px",
							fontWeight: "500",
							mb: "16px",
							color: "white",
						}}
					>
						{user && (
							<>
								@{user.celo_id}
								<IconButton
									onClick={() => {
										setIsOpenQR(true);
									}}
								>
									<AiFillDollarCircle color="#FFD700" />
								</IconButton>
							</>
						)}
					</Box>
				)}
				<ValoQr
					isOpen={isOpenQR}
					address={user?.id}
					displayName={user?.celo_id}
					handleExternalClose={() => {
						setIsOpenQR(false);
					}}
				/>

				{loading ? (
					<Box
						sx={{
							padding: { xs: "0 5%", sm: "0 10%", md: "0 20%" },
							width: "100%",
						}}
					>
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								variant="rectangular"
								sx={{ my: 1, borderRadius: "8px" }}
								height={"125px"}
								key={i}
							/>
						))}
					</Box>
				) : (
					links.map((l, i) => (
						<LinkContainer
							key={i}
							onClick={async () => {
								await getLink(l.data.id);
								window.open(`https://${l.data.url}`, "_blank");
							}}
						>
							<LinkImg
								style={
									l.data.image
										? {
												backgroundImage: `url(${l.data.image})`,
												backgroundPosition: "center",
												backgroundRepeat: "no-repeat",
												backgroundSize: "cover",
												borderRadius: "50px",
										  }
										: {}
								}
							></LinkImg>
							<Box>{l.data.title}</Box>
							<IconButton aria-label="share">
								<AiOutlineShareAlt />
							</IconButton>
						</LinkContainer>
					))
				)}
			</MainContainer>
		</div>
	);
}

const MainContainer = muiStyled(Box)({
	height: "100vh",
	width: "100vw",

	backgroundColor: "white",

	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",

	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	//   justifyContent: "center",
});

const LinkContainer = muiStyled(Box)({
	width: "80%",
	maxWidth: "990px",
	border: "2px solid rgb(0, 0, 0)",
	boxShadow: "rgb(0, 0, 0) 8px 8px 0px 0px",
	color: "rgb(0, 0, 0)",
	backgroundColor: "rgb(255, 254, 254)",

	borderRadius: "30px",

	textAlign: "center",
	padding: "10px 18px",

	marginBottom: "16px",

	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",

	cursor: "pointer",
});

const LinkImg = muiStyled(Box)({
	width: "50px",
	height: "50px",
});
