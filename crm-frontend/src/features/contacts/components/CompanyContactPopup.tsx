import { Phone, X } from "lucide-react";

interface ContactPopupsProps {
    onClose: () => void;
}

export default function CompanyContactPopup({onClose}: ContactPopupsProps) {

    return(
        <form action="" onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#1A1A1A] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Phone />
                <p>Agregar nuevo contacto</p>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre completo del contacto</p>
                <input type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el nombre del contacto..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Puesto en la empresa</p>
                    <input type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el puesto del contacto..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Número de teléfono</p>
                    <input type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el teléfono del contacto..." />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Correo electrónico</p>
                <input type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el correo electrónico del contacto..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">LinkedIn</p>
                <input type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el link de LinkedIn..." />
            </div>

            <div className="flex gap-3">
                <div></div>
                <p className="text-sm">Es el contacto principal de la empresa</p>
            </div>

            <div className="flex justify-center">
                <button className="w-1/3 bg-[#2F76D2] rounded-md px-2 py-1">Crear contacto</button>
            </div>
        </form>
    )
}