import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema ({

    business:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Business"
    },

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    opportunity:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Opportunity"
    },

    serviceTemplate:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceTemplate"
    },

    name: String,

    status:{
        type:String,
        enum:[
            "Planeacion",
            "Ejecucion",
            "Cierre",
            "Cerrado"
        ],
        default:"Planeacion"
    },

    manager: String, 

    startDate: Date,

    dueDate: Date,

    deliveryDate: Date,

    scope:{

        domains:[String],

        subdomains:[String],

        ips:[String],

        applications:[String],

        apis:[String],

        exclusions:[String],

        allowedHours:String,

        technicalContact:String

    },

    assets:[{

        name:String,

        ip:String,

        hostname:String,

        type:String,

        operatingSystem:String,

        criticality:String,

        comments:String

    }],

    phases:[{

        name:String,

        order:Number,

        status:String,

        startedAt:Date,

        finishedAt:Date,

        checklist:[{

            task:String,

            status:{
                type:String,
                enum:["Pendiente","En progreso","Completado"],
                default:"Pendiente"
            },

            completed:Boolean,

            completedAt:Date

        }]

    }],

    deliverables:[{

        name:String,

        completed:Boolean,

        version:Number,

        deliveredAt:Date

    }],

    timeline:[{

        title:String,

        description:String,

        user:String,

        createdAt:Date

    }]
}, {
    timestamps: true
})

export default mongoose.model("Project", ProjectSchema);