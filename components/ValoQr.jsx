import { Box, Button, Dialog, TextField } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

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
				{Object.entries(state).map(([key, value]) => (
					<Box
						sx={{
							mb: 1,
						}}
						key={key}
					>
						<TextField
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
					</Box>
				))}
				<Button onClick={generate} variant="contained">
					Generate
				</Button>
				{url && <QRCodePage url={url} />}
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
