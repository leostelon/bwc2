import { Box, Dialog, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PurpleButton } from "./PurpleButton";
import { toast } from "react-toastify";
import { Info } from "./Info";
import { registerAttestation } from "@/utils/celo";
import { createLink } from "@/database/link";

export default function AddTwitter({ isOpen, handleExternalClose }) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);

	const handleClose = () => {
		setOpen(false);
		if (handleExternalClose) {
			handleExternalClose();
		}
	};

	async function aT() {
		if (title === "")
			return toast("Please fill all the details!", { type: "info" });
		setLoading(true);
		const userAccount = localStorage.getItem("address");
		await registerAttestation(title, userAccount, "twitter");
		await createLink(`https://twitter.com/${title}`, "Twitter");
		toast("New link created succesfully🥳", { type: "success" });
		setLoading(false);
		handleClose();
	}

	useEffect(() => {
		if (isOpen) {
			setOpen(isOpen);
		}
	}, [isOpen]);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
			<Box
				sx={{
					p: 2,
					textAlign: "center",
					width: "100%",
				}}
			>
				<h2>Add Twitter🐦</h2>
				<Info
					title={"Add twitter handle"}
					description={
						"Adding twitter handle will not be verified by any means but will be recorded on-chain using Social Connect SDK."
					}
				/>
				<FormControl fullWidth>
					<TextField
						id="LinkTitle"
						type="url"
						label="Twitter Handle"
						size="small"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</FormControl>
				<br />
				<br />
				<PurpleButton title={"Add Twitter"} onClick={aT} loading={loading} />
			</Box>
		</Dialog>
	);
}
