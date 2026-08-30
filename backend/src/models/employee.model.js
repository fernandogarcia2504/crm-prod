import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({

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

    fullName: { type: String, required: true },
    position: String,
    email: { type: String, required: true },

    sector: String,

    status: {
        type: String,
        enum: ["Activo", "Inactivo"],
        default: "Activo"
    },

    // Credenciales del curso de concientizacion. La contraseña nunca se
    // guarda en texto plano, solo su hash; el texto plano se devuelve
    // una unica vez en la respuesta del endpoint que la genera.
    courseAccount: {

        username: String,

        passwordHash: String,

        credentialsIssuedAt: Date,

        // true mientras la contraseña siga siendo la temporal generada
        // al enrolar/regenerar credenciales. Se pone en false cuando el
        // empleado la cambia por una propia (ver changePassword en
        // coursePortal.controller.js). Los documentos viejos que no
        // tengan este campo se tratan como true en el codigo (nunca la
        // cambiaron tampoco), no hace falta migrarlos.
        mustChangePassword: { type: Boolean, default: true },

        // Curso de concientizacion asignado (solo hay uno activo por
        // negocio, pero se guarda la referencia por si en el futuro
        // se crea mas de uno).
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null
        },

        enrolled: { type: Boolean, default: false },
        enrolledAt: Date,

        completed: { type: Boolean, default: false },
        completedAt: Date,

        progress: { type: Number, default: 0 },

        // Avance por modulo del curso asignado. Se resetea cada vez que
        // se (re)asigna un curso (ver assignCourseToCompany).
        moduleProgress: [{

            module: { type: mongoose.Schema.Types.ObjectId, required: true },

            completed: { type: Boolean, default: false },
            completedAt: Date,

            quizScore: Number

        }]

    },

    notes: String

}, {
    timestamps: true
});

// Un mismo correo no deberia repetirse dos veces dentro de la misma empresa
EmployeeSchema.index({ company: 1, email: 1 }, { unique: true });

export default mongoose.model("Employee", EmployeeSchema);