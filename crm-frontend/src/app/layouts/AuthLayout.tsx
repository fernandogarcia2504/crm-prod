import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="bg-[#141414] w-full h-screen text-[#ECECEC]">
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    )
}