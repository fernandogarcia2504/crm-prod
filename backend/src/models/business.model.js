import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({

    name:String,

    description:String,

    // Distingue la linea de negocio para poder mostrar/ocultar features
    // que solo aplican a una de ellas (ej. Empleados y Campañas de
    // phishing no tienen sentido para Evaluación de Vulnerabilidades)
    type: {
        type: String,
        enum: ["Evaluación de Vulnerabilidades", "Concientización en Seguridad"],
        default: "Evaluación de Vulnerabilidades"
    },

    // URL del servidor Gophish usado para lanzar campañas de este negocio
    // (ej. https://192.168.100.124:3333). Solo aplica a Concientización
    // en Seguridad; se guarda aqui para tener un acceso rapido desde el CRM.
    gophishUrl: String,

    active:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
})

export default mongoose.model("Business", BusinessSchema);