import {
	Box,
	Button,
	Dialog,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { LocalCurrencySymbol } from "../assets/LOCAL_CURRENCY_CODES";

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
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState({
		comment: "",
		token: "",
		amount: "",
		currencyCode: "",
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
		<Dialog open={open} onClose={handleClose}>
			<Box
				sx={{
					p: 2,
					// textAlign: "center",
					// width: "100%",
					// height: "20px",
				}}
			>
				{!url && (
					<Box>
						{Object.entries(state).map(([key, value]) => (
							<Box
								sx={{
									mb: 1,
								}}
								key={key}
							>
								{key === "currencyCode" ? (
									<FormControl fullWidth size="small">
										<InputLabel>
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
									<FormControl fullWidth size="small">
										<InputLabel>
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
										>
											{TOKEN.map(({ value, key }) => (
												<MenuItem value={value} key={key}>
													{key} <small> ({value})</small>{" "}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								) : (
									<TextField
										fullWidth
										value={value}
										onChange={(e) => {
											setState({
												...state,
												[key]: e.target.value,
											});
										}}
										label={
											key.charAt(0).toUpperCase() +
											key.slice(1).replace(/([A-Z])/g, " $1")
										}
										size="small"
									/>
								)}
							</Box>
						))}
						<Box sx={{ textAlign: "right" }}>
							<Button onClick={generate} variant="contained">
								Generate
							</Button>
						</Box>
					</Box>
				)}

				<Box>
					{url && (
						<Box>
							<QRCodePage url={url} />
							<Box sx={{ textAlign: "right" }}>
								<Button
									onClick={() => {
										setState({
											comment: "",
											token: "",
											amount: "",
											currencyCode: "",
										});
										setUrl();
									}}
									variant="contained"
									color="error"
								>
									Re-Generate
								</Button>
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
		generateQRCode();
	}, []);

	const generateQRCode = async () => {
		const canvas = canvasRef.current;

		try {
			await QRCode.toCanvas(canvas, url);
		} catch (error) {
			console.error("Failed to generate QR code", error);
		}
	};

	return <canvas ref={canvasRef} />;
}
