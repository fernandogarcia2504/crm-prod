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

    // Precio final acordado con el cliente al ganar la oportunidad. Es lo
    // que alimenta las metricas de la pagina de Finanzas (progreso hacia
    // la meta anual, facturacion del mes, ticket promedio, etc).
    finalAmount: {
        type: Number,
        default: null
    },

    // Fecha en la que se factura este proyecto. Independiente de cuando
    // se gano la oportunidad o de la fecha de entrega: es la fecha que
    // determina en que mes/año cuenta este proyecto para las metricas
    // financieras.
    billedAt: {
        type: Date,
        default: null
    },

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