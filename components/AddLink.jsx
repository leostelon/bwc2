import { Box, Dialog, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PurpleButton } from "./PurpleButton";
import { createLink } from "../database/link";
import { toast } from "react-toastify";

export default function AddLink({ isOpen, handleExternalClose }) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [link, setLink] = useState("");
	const [loading, setLoading] = useState(false);

	const handleClose = () => {
		setOpen(false);
		if (handleExternalClose) {
			handleExternalClose();
		}
	};

	async function aL() {
		if (link === "" || title === "")
			return toast("Please fill all the details!", { type: "info" });
		setLoading(true);
		await createLink(link, title);
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
		<Dialog open={open} onClose={handleClose}>
			<Box
				sx={{
					p: 2,
					textAlign: "center",
					width: "100%",
					maxWidth: "350px",
				}}
			>
				<h2>Add New Link</h2>
				<FormControl fullWidth sx={{ mt: 2 }}>
					<TextField
						id="LinkTitle"
						label="Title"
						variant="outlined"
						size="small"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</FormControl>
				<FormControl fullWidth sx={{ mt: 2 }}>
					<TextField
						id="Link"
						label="Link"
						variant="outlined"
						size="small"
						value={link}
						onChange={(e) => setLink(e.target.value)}
					/>
				</FormControl>
				<br />
				<br />
				<PurpleButton title={"Add link"} onClick={aL} loading={loading} />
			</Box>
		</Dialog>
	);
}
