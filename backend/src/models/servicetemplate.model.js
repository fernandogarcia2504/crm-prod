import mongoose from "mongoose";

const ServiceTemplateSchema = new mongoose.Schema ({

    business:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Business"
    },

    name: String,
    description: String,
    active: Boolean,

    phases: [{
        name: String,
        order: Number,
        description: String,
        checklist: [String]
    }],

    deliverables:[{

        name:String,

        required:Boolean

    }],

    expectedEvidence:[{

        name:String,

        required:Boolean

    }],

    projectStructure: [String],

    estimatedDuration: Number,

    kpis: [String]
}, {
    timestamps: true
})

export default mongoose.model("ServiceTemplate", ServiceTemplateSchema);