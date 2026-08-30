import mongoose from "mongoose";

// Un modulo puede traer PDF, video (subido a S3 o un link externo tipo
// Vimeo/YouTube no listado) y/o un quiz. No son excluyentes: un modulo
// tipico es "PDF de lectura + quiz al final".
const CourseModuleSchema = new mongoose.Schema({

    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    description: String,

    pdf: {
        s3Key: String,
        s3Bucket: String,
        originalName: String
    },

    video: {
        s3Key: String,
        s3Bucket: String,
        originalName: String,
        externalUrl: String // alternativa si el video no se aloja en S3
    },

    quiz: [{
        question: String,
        options: [String],
        correctIndex: Number
    }],

    // Puntaje minimo (0-100) para que el quiz del modulo se considere
    // aprobado. Si el modulo no tiene quiz, se ignora.
    passingScore: { type: Number, default: 80 }

});

const CourseSchema = new mongoose.Schema({

    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },

    title: { type: String, required: true },
    description: String,

    active: { type: Boolean, default: true },

    modules: [CourseModuleSchema]

}, {
    timestamps: true
});

export default mongoose.model("Course", CourseSchema);
