import { Outlet, useLocation, useParams } from "react-router-dom";

import CompanyNavbar from "../../components/layout/CompanyNavbar";
import ProjectNavbar from "../../components/layout/ProjectNavbar";

export default function MainLayout() {

    const location = useLocation();
    const { companyId, projectId } = useParams();

    const isIndividualCompanyRoute = Boolean(companyId);

    const hideNavbar =
        Boolean(projectId) ||
        location.pathname.endsWith("/entrepeneurship");

    return (
        <div className="bg-[#141414] w-full min-h-screen text-[#ECECEC] flex flex-col items-center">

            {!hideNavbar && (
                isIndividualCompanyRoute ? <ProjectNavbar /> : <CompanyNavbar />)}

            <main className="w-[80%]">
                <Outlet />
            </main>

        </div>
    );
}