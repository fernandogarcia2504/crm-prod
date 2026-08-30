import mongoose from "mongoose";

const companySchema = new mongoose.Schema ({
    business:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Business",
        required:true
    },

    name: {type: String, required: true},
    website: {type: String, required: true},
    companySize: {type: String, required: true},
    leadSource: {type: String},

    status: {
        type:String,
        enum: [
            "Prospecto",
            "Cliente",
            "Inactivo"
        ],
        default: "Prospecto"
    },

    notes: String,
    address: {
        country: String,
        state: String,
        city: String,
        pc: String,
        street: String
    }
}, {
    timestamps: true
})

export default mongoose.model("Company", companySchema);