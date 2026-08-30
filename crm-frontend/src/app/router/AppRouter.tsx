import { Routes, Route, BrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../../features/auth/LoginPage";

import EntrepeneurshipPage from "../../features/entrepeneurship/EntrepeneurshipPage";

import CompanyPage from "../../features/companies/pages/CompanyPage";
import Finances from "../../features/finances/pages/FinancesPage";
import ContactsPage from "../../features/contacts/pages/ContactsPage";
import TemplatesPage from "../../features/templates/pages/TemplatesPage";
import TemplatePage from "../../features/templates/pages/TemplatePage";

import DocumentsPage from "../../features/documents/pages/DocumentsPage";
import ProjectsPage from "../../features/projects/pages/ProjectsPage";
import ProjectPage from "../../features/projects/pages/ProjectPage"
import CompanyActivitiesPage from "../../features/activities/pages/CompanyActivitiesPage";
import OpportunitiesPage from "../../features/opportunities/pages/OpportunitiesPage";
import CompanyContactsPage from "../../features/contacts/pages/CompanyContactsPage";

import CompanyEmployeesPage from "../../features/employees/pages/CompanyEmployeesPage";
import CompanyGradesPage from "../../features/employees/pages/CompanyGradesPage";
import ProjectCampaignsPage from "../../features/phishing/pages/ProjectCampaignsPage";
import CampaignPage from "../../features/phishing/pages/CampaignPage";
import CoursePage from "../../features/courses/pages/CoursePage";

import { AuthProvider } from "../context/AuthContext";
import { BusinessProvider } from "../context/BusinessContext";

export default function AppRouter() {
    return (
        <AuthProvider>
            <BusinessProvider >
                <BrowserRouter>
                    <Routes>
                        <Route element={<AuthLayout />}>
                            <Route path="/" element={<LoginPage />} />
                        </Route>
                            <Route element={<ProtectedRoute />} >
                                <Route element={<MainLayout />}>
                                    <Route path="/entrepeneurship" element={<EntrepeneurshipPage />} />

                                    <Route path="/entrepeneurship/companies" element={<CompanyPage />} />
                                    <Route path="/entrepeneurship/finances" element={<Finances />} />
                                    <Route path="/entrepeneurship/templates" element={<TemplatesPage />} />
                                    <Route path="/entrepeneurship/templates/:templateId" element={<TemplatePage />} />
                                    <Route path="/entrepeneurship/contacts" element={<ContactsPage />} />
                                    <Route path="/entrepeneurship/course" element={<CoursePage />} />

                                    <Route path="/entrepeneurship/:companyId/projects" element={<ProjectsPage />} />
                                    <Route path="/entrepeneurship/:companyId/projects/:projectId" element={<ProjectPage />} />
                                    <Route path="/entrepeneurship/:companyId/documents" element={<DocumentsPage />} />
                                    <Route path="/entrepeneurship/:companyId/contacts" element={<CompanyContactsPage />} />
                                    <Route path="/entrepeneurship/:companyId/activities" element={<CompanyActivitiesPage />} />
                                    <Route path="/entrepeneurship/:companyId/opportunities" element={<OpportunitiesPage />} />

                                    <Route path="/entrepeneurship/:companyId/employees" element={<CompanyEmployeesPage />} />
                                    <Route path="/entrepeneurship/:companyId/grades" element={<CompanyGradesPage />} />
                                    <Route path="/entrepeneurship/:companyId/projects/:projectId/campaigns" element={<ProjectCampaignsPage />} />
                                    <Route path="/entrepeneurship/:companyId/projects/:projectId/campaigns/:campaignId" element={<CampaignPage />} />
                                    
                                </Route>
                            </Route>
                    </Routes>
                </BrowserRouter>
            </BusinessProvider>
        </AuthProvider>

    )
}