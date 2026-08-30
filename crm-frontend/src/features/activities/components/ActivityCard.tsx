import {
    Mail,
    Phone,
    MessageCircle,
    Link,
    Calendar,
    Presentation,
    MapPin,
    MoreHorizontal
} from "lucide-react";

type ActivityType =
    | "Correo"
    | "Llamada"
    | "WhatsApp"
    | "LinkedIn"
    | "Reunion"
    | "Demo"
    | "Visita"
    | "Otro";

interface ActivityCardProps {
    title: string;
    result: string;
    nextStep: string;
    date: string;
    type: ActivityType;
    isLast?: boolean;
}

const activityConfig = {
    Correo: {
        icon: Mail,
        color: "#2FD260"
    },
    Llamada: {
        icon: Phone,
        color: "#2F76D2"
    },
    WhatsApp: {
        icon: MessageCircle,
        color: "#25D366"
    },
    LinkedIn: {
        icon: Link,
        color: "#2F9CD2"
    },
    Reunion: {
        icon: Calendar,
        color: "#6B2FD2"
    },
    Demo: {
        icon: Presentation,
        color: "#D2822F"
    },
    Visita: {
        icon: MapPin,
        color: "#D22F5C"
    },
    Otro: {
        icon: MoreHorizontal,
        color: "#767676"
    }
}

export default function ActivityCard({ title, result, nextStep, date, type, isLast=false}: ActivityCardProps) {

    const {icon: Icon, color} = activityConfig[type];

    return(
        <div className="w-full grid grid-cols-[3%_60%_25%_10%] px-3 items-center gap-2 cursor-pointer">

            <div className="flex flex-col items-center relative">
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: color }}
                >
                    <Icon size={18} />
                </div>

                {!isLast && (
                    <div
                        className="absolute top-9 left-1/2 -translate-x-1/2 w-0 h-10 border-l-2 border-dashed border-gray-500"
                    />
                )}

            </div>

            <div className="flex flex-col ">
                <p>{title}</p>
                <p className="text-sm text-[#959595]">{nextStep}</p>
            </div>

            <p className="text-sm text-[#959595]">{date}</p>

        </div>
    )
}
