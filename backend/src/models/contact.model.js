import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema ({

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },
    
    fullName: String,
    position: String,
    email: String,
    phone: String,
    linkedin: String,

    isPrimary:{
        type:Boolean,
        default:false
    },
    notes:String
}, {
    timestamps: true
})

export default mongoose.model("Contact", ContactSchema);