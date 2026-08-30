import mongoose from "mongoose";

// Un target = un Employee dentro de una campaña puntual de phishing.
// Se registra el embudo completo (enviado -> abierto -> clic -> envio de
// datos -> reportado), no solo "clic", porque "reportado" es el KPI que
// realmente mide si la concientizacion esta funcionando.
const PhishingTargetSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    sent: { type: Boolean, default: false },
    sentAt: Date,

    opened: { type: Boolean, default: false },
    openedAt: Date,

    clicked: { type: Boolean, default: false },
    clickedAt: Date,

    submittedData: { type: Boolean, default: false },
    submittedAt: Date,

    reported: { type: Boolean, default: false },
    reportedAt: Date

});

const PhishingCampaignSchema = new mongoose.Schema({

    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    name: { type: String, required: true },

    // Referencia libre a lo que ya existe del lado de gophish/mailgun.
    // No se integra en vivo con la API de gophish todavia, este campo
    // solo guarda el identificador para poder cruzar datos manualmente.
    gophishCampaignId: String,

    emailTemplate: String,
    landingPage: String,
    sendingProfile: String,
    senderDomain: String,

    // URL publica donde Gophish sirve la landing page (la que va en los
    // links del correo). Distinta de Business.gophishUrl, que es el panel
    // de administracion. Ej. https://track.midominio.com
    campaignUrl: String,

    launchDate: Date,

    status: {
        type: String,
        enum: ["Planeada", "En curso", "Completada"],
        default: "Planeada"
    },

    targets: [PhishingTargetSchema],

    notes: String

}, {
    timestamps: true
});

export default mongoose.model("PhishingCampaign", PhishingCampaignSchema);
