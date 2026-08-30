// Script de una sola vez para crear el ServiceTemplate de la nueva
// unidad de negocio: concientizacion en seguridad (curso + phishing
// simulado con gophish + mailgun).
//
// Uso:
//   cd backend
//   node src/scripts/seedPhishingTemplate.js "Nombre exacto del Business"
//
// Si el Business no existe, se crea. Si el ServiceTemplate ya existe
// (mismo nombre), el script no hace nada y termina.

import "dotenv/config";
import mongoose from "mongoose";

import Business from "../models/business.model.js";
import ServiceTemplate from "../models/servicetemplate.model.js";

const BUSINESS_NAME = process.argv[2] || "Simulacion Phishing";
const TEMPLATE_NAME = "Concientización en Seguridad - Phishing Simulado";

const run = async () => {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");

    try {

        let business = await Business.findOne({ name: BUSINESS_NAME });

        if (!business) {
            business = await Business.create({
                name: BUSINESS_NAME,
                description: "Cursos de concientización en seguridad y simulaciones de phishing (gophish + mailgun) para empleados de clientes.",
                type: "Concientización en Seguridad",
                active: true
            });
            console.log(`Business creado: ${business.name} (id: ${business._id})`);
        } else {
            if (business.type !== "Concientización en Seguridad") {
                business.type = "Concientización en Seguridad";
                await business.save();
            }
            console.log(`Business existente reutilizado: ${business.name} (id: ${business._id})`);
        }

        const serviceTemplate = await ServiceTemplate.create({
            business: business._id,
            name: TEMPLATE_NAME,
            description: "Programa de concientización en seguridad: curso en línea para empleados combinado con campañas de phishing simulado (gophish + mailgun) para medir y reducir el riesgo humano.",
            active: true,

            phases: [
                {
                    name: "Alcance y Autorización",
                    order: 1,
                    description: "Formalizar el alcance con el cliente y preparar la infraestructura de envío antes de tocar ningún dato de empleados.",
                    checklist: [
                        "Firmar autorización de simulación de phishing con el cliente",
                        "Definir dominios y remitentes a usar en Mailgun",
                        "Configurar SPF, DKIM y DMARC en los dominios",
                        "Calentar los dominios antes del envío masivo",
                        "Definir política de retención y borrado de datos de empleados"
                    ]
                },
                {
                    name: "Levantamiento de Empleados",
                    order: 2,
                    description: "Recolectar y cargar el listado de empleados que será usado tanto en gophish como en el curso.",
                    checklist: [
                        "Solicitar al cliente el listado de empleados (nombre, puesto, correo, sector)",
                        "Cargar empleados en la plataforma",
                        "Generar credenciales del curso de concientización",
                        "Validar correos duplicados o inválidos"
                    ]
                },
                {
                    name: "Configuración en Gophish",
                    order: 3,
                    description: "Dejar listas las plantillas, landing page y perfil de envío en gophish antes de lanzar la campaña base.",
                    checklist: [
                        "Crear plantillas de correo en Gophish",
                        "Crear landing page educativa post-clic",
                        "Configurar sending profile con el dominio de Mailgun",
                        "Importar grupo de objetivos desde el listado de empleados"
                    ]
                },
                {
                    name: "Campaña de Phishing Base (Baseline)",
                    order: 4,
                    description: "Medir el riesgo real antes de cualquier entrenamiento.",
                    checklist: [
                        "Lanzar campaña base sin previo aviso",
                        "Monitorear métricas en tiempo real (enviados, abiertos, clics, reportados)",
                        "Registrar métricas en el proyecto",
                        "Identificar empleados que hicieron clic o enviaron datos"
                    ]
                },
                {
                    name: "Análisis y Enrolamiento al Curso",
                    order: 5,
                    description: "Convertir los resultados del baseline en enrolamiento dirigido al curso.",
                    checklist: [
                        "Analizar resultados por sector/departamento",
                        "Enviar credenciales del curso a todos los empleados",
                        "Enrolar prioritariamente a quienes fallaron la prueba base",
                        "Dar seguimiento al avance del curso"
                    ]
                },
                {
                    name: "Campaña de Reforzamiento (Re-test)",
                    order: 6,
                    description: "Confirmar si el entrenamiento redujo el riesgo real.",
                    checklist: [
                        "Lanzar segunda campaña de phishing tras completar el curso",
                        "Comparar tasa de clics y de reporte contra la campaña base",
                        "Documentar mejora o áreas de riesgo persistentes"
                    ]
                },
                {
                    name: "Reporte Final y Entrega",
                    order: 7,
                    description: "Cerrar el engagement con el entregable que justifica el servicio ante el cliente.",
                    checklist: [
                        "Elaborar reporte de riesgo por empleado, sector y compañía",
                        "Incluir comparativo baseline vs re-test",
                        "Presentar recomendaciones al cliente",
                        "Entregar reporte final y cerrar el proyecto"
                    ]
                }
            ],

            deliverables: [
                { name: "Autorización firmada de simulación de phishing", required: true },
                { name: "Reporte de resultados baseline", required: true },
                { name: "Reporte de resultados re-test", required: true },
                { name: "Reporte final de riesgo y recomendaciones", required: true },
                { name: "Constancias de finalización del curso", required: false }
            ],

            expectedEvidence: [
                { name: "Capturas de métricas de Gophish", required: true },
                { name: "Listado de empleados enrolados", required: true },
                { name: "Evidencia de configuración SPF/DKIM/DMARC", required: true }
            ],

            projectStructure: [
                "Alcance y Autorización",
                "Levantamiento de Empleados",
                "Configuración en Gophish",
                "Campaña Base",
                "Análisis y Enrolamiento",
                "Campaña de Reforzamiento",
                "Reporte Final"
            ],

            estimatedDuration: 45,

            kpis: [
                "Tasa de clics (baseline)",
                "Tasa de clics (re-test)",
                "Tasa de reporte de correos sospechosos",
                "Porcentaje de empleados que completaron el curso",
                "Reducción de tasa de clics entre baseline y re-test"
            ]
        });

        console.log(`ServiceTemplate creado: ${serviceTemplate.name} (id: ${serviceTemplate._id})`);

    } finally {

        await mongoose.disconnect();

    }

};

run().catch((error) => {
    console.error("Error al sembrar el template:", error);
    process.exit(1);
});
