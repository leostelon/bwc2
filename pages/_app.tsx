import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Component {...pageProps} />
			<ToastContainer position="bottom-center" pauseOnHover autoClose={3000} />
		</Layout>
	);
}

export default App;
