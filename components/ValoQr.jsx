import {
	Box,
	Dialog,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { LocalCurrencySymbol } from "../assets/LOCAL_CURRENCY_CODES";
import { BlueButton } from "./BlueButton";

const TOKEN = [
	{
		value: "cUSD",
		key: "celo Dollar",
	},
	{
		value: "cEUR",
		key: "celo Euro",
	},
	{
		value: "CELO",
		key: "CELO",
	},
	{
		value: "cREAL",
		key: "celo Real",
	},
];

export default function ValoQr({
	isOpen,
	handleExternalClose,
	address,
	displayName,
}) {
	const [open, setOpen] = useState(false);
	const [state, setState] = useState({
		token: "",
		amount: "",
		currencyCode: "",
		comment: "",
	});
	const [url, setUrl] = useState();

	const handleClose = () => {
		setOpen(false);
		if (handleExternalClose) {
			setUrl();
			setState({
				comment: "",
				token: "",
				amount: "",
				currencyCode: "",
			});

			handleExternalClose();
		}
	};

	useEffect(() => {
		if (isOpen) {
			setOpen(isOpen);
		}
	}, [isOpen]);

	const generate = () => {
		let url = `celo://wallet/pay?address=${address}&displayName=${displayName}`;
		Object.entries(state).forEach(([key, value]) => {
			if (value) {
				url += `&${key}=${value.replace(/ /g, "%20")}`;
			}
		});
		console.log(url);
		setUrl(url);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: { borderRadius: "12px" },
			}}
			fullWidth
		>
			<Box
				sx={{
					p: 2,
					textAlign: "center",
					color: "#303031",
					borderRadius: "14px",
				}}
			>
				{!url && (
					<Box>
						<Box mb={1}>
							<h2>Payment Details</h2>
						</Box>
						<p style={{ fontSize: "14px", color: "#828488" }}>
							Enter valid details to generate QR code
						</p>
						<br />
						<Box px={"20%"}>
							{Object.entries(state).map(([key, value]) => (
								<Box
									sx={{
										mb: 1,
									}}
									key={key}
								>
									{key === "currencyCode" ? (
										<FormControl
											fullWidth
											size="small"
											sx={{
												textAlign: "start",
											}}
										>
											<InputLabel sx={{ fontSize: "14px", color: "#828488" }}>
												{key.charAt(0).toUpperCase() +
													key.slice(1).replace(/([A-Z])/g, " $1")}
											</InputLabel>
											<Select
												value={value}
												label={
													key.charAt(0).toUpperCase() +
													key.slice(1).replace(/([A-Z])/g, " $1")
												}
												onChange={(e) => {
													setState({
														...state,
														[key]: e.target.value,
													});
												}}
												sx={{
													boxShadow: "none",
													backgroundColor: "#e8e8e89f",
													".MuiOutlinedInput-notchedOutline": { border: 0 },
												}}
											>
												{Object.entries(LocalCurrencySymbol).map(
													([key, value]) => (
														<MenuItem value={key} key={key}>
															{key} <small> ({value})</small>{" "}
														</MenuItem>
													)
												)}
											</Select>
										</FormControl>
									) : key === "token" ? (
										<FormControl
											fullWidth
											size="small"
											sx={{
												textAlign: "start",
											}}
										>
											<InputLabel sx={{ fontSize: "14px", color: "#828488" }}>
												{key.charAt(0).toUpperCase() +
													key.slice(1).replace(/([A-Z])/g, " $1")}
											</InputLabel>
											<Select
												value={value}
												label={
													key.charAt(0).toUpperCase() +
													key.slice(1).replace(/([A-Z])/g, " $1")
												}
												onChange={(e) => {
													setState({
														...state,
														[key]: e.target.value,
													});
												}}
												sx={{
													boxShadow: "none",
													backgroundColor: "#e8e8e89f",
													".MuiOutlinedInput-notchedOutline": { border: 0 },
												}}
											>
												{TOKEN.map(({ value, key }) => (
													<MenuItem value={value} key={key}>
														{key} <small> ({value})</small>{" "}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : (
										<Box
											className="search-container"
											sx={{ justifyContent: "flex-start" }}
										>
											<input
												type="url"
												placeholder={
													key.charAt(0).toUpperCase() +
													key.slice(1).replace(/([A-Z])/g, " $1")
												}
												value={value}
												onInput={(e) =>
													setState({
														...state,
														[key]: e.target.value,
													})
												}
											/>
										</Box>
										// <TextField
										// 	fullWidth
										// 	value={value}
										// 	onChange={(e) => {
										// 		setState({
										// 			...state,
										// 			[key]: e.target.value,
										// 		});
										// 	}}
										// 	label={
										// 		key.charAt(0).toUpperCase() +
										// 		key.slice(1).replace(/([A-Z])/g, " $1")
										// 	}
										// 	size="small"
										// />
									)}
								</Box>
							))}
							<br />
							<BlueButton title={"Generate QR"} onClick={generate} />
						</Box>
					</Box>
				)}

				<Box>
					{url && (
						<Box>
							<Box mb={1}>
								<h2>Scan QR code</h2>
							</Box>
							<p style={{ fontSize: "14px", color: "#828488" }}>
								Scan this code using Valora app to make payment
							</p>
							<br />
							<Box px={"20%"}>
								<QRCodePage url={url} />
								<Box>
									<BlueButton
										title={"New Payment"}
										onClick={() => {
											setState({
												comment: "",
												token: "",
												amount: "",
												currencyCode: "",
											});
											setUrl();
										}}
									/>
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Dialog>
	);
}

function QRCodePage({ url }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (url) generateQRCode(url);
	}, [url]);

	const generateQRCode = async (url) => {
		const canvas = canvasRef.current;

		try {
			await QRCode.toCanvas(canvas, url);
		} catch (error) {
			console.error("Failed to generate QR code", error);
		}
	};

	return <canvas ref={canvasRef} />;
}
