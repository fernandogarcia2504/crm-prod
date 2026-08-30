import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import companyRoutes from "./routes/company.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import serviceTemplateRoutes from "./routes/serviceTemplate.routes.js"
import projectRoutes from "./routes/project.routes.js"
import documentRoutes from "./routes/document.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import phishingCampaignRoutes from "./routes/phishingCampaign.routes.js"
import gophishRoutes from "./routes/gophish.routes.js"
import courseRoutes from "./routes/course.routes.js"
import courseAuthRoutes from "./routes/courseAuth.routes.js"
import coursePortalRoutes from "./routes/coursePortal.routes.js"

import { verifyToken, verifyEmployeeToken } from "./middlewares/auth.middleware.js";

const app = express();

const allowedOrigins = [
    process.env.CRM_ORIGIN || "http://localhost:5173",
    process.env.COURSES_ORIGIN || "http://localhost:5174"
];

app.use(cors({
    origin: (origin, callback) => {

        // Sin origin = llamadas server-to-server / curl / Postman, se dejan pasar
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Origen no permitido por CORS"));

    }
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/business", verifyToken, businessRoutes);
app.use("/api/companies", verifyToken, companyRoutes);
app.use("/api/contacts", verifyToken, contactRoutes);
app.use("/api/opportunities", verifyToken, opportunityRoutes);
app.use("/api/activities", verifyToken, activityRoutes);
app.use("/api/service-templates", verifyToken, serviceTemplateRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/documents", verifyToken, documentRoutes);
app.use("/api/employees", verifyToken, employeeRoutes);
app.use("/api/phishing-campaigns", verifyToken, phishingCampaignRoutes);
app.use("/api/gophish", verifyToken, gophishRoutes);

// Contenido de los cursos: administrado por staff (mismo verifyToken de siempre)
app.use("/api/courses", verifyToken, courseRoutes);

// Portal de cursos para trainees (empleados): login publico + rutas
// protegidas con su propio token, nunca con el verifyToken de staff
app.use("/api/course-auth", courseAuthRoutes);
app.use("/api/course-portal", verifyEmployeeToken, coursePortalRoutes);

export default app;