import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
    children: ReactNode
}
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

export default Layout;