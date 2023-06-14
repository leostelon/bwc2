import { Box, CircularProgress } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import React from "react";

export const PurpleButton = ({ onClick, title, loading }) => {
	return (
		<Box
			onClick={onClick}
			sx={{
				backgroundColor: deepPurple[500],
				color: "white",
				padding: "8px 16px",
				borderRadius: "4px",
				fontWeight: "600",
				marginRIght: "32px",
				cursor: "pointer",
				minWidth: "100px",
				textAlign: "center",
			}}
		>
			{loading ? <CircularProgress size={14} sx={{ color: "white" }} /> : title}
		</Box>
	);
};
