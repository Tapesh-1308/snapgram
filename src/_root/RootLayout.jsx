import TopBar from "../components/shared/TopBar";
import useAuthCheck from "../hooks/useAuthCheck"
import LeftSideBar from "../components/shared/LeftSideBar";
import { Outlet } from "react-router-dom";
import BottomBar from "../components/shared/BottomBar";

const RootLayout = () => {
    useAuthCheck();
    return (
        <div className="w-full md:flex">
            <TopBar />
            <LeftSideBar />

            <section className="flex flex-1 h-full">
                <Outlet />
            </section>

            <BottomBar />
        </div>
    )
}

export default RootLayout