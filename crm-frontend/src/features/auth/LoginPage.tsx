import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../app/context/AuthContext";

import { motion } from "framer-motion";

import Aston from "../../assets/AstonMartin.png"

export default function() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username:"", password:""})

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSumbit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try{

            const response = await fetch("http://localhost:3000/api/auth/login", {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.message || "Credenciales incorrectas")
            }

            if (!authContext) {
                throw new Error("AuthContext no disponible");
            }

            authContext.login(
                data.token,
                data.user.id,
                data.user.role
            );
            navigate("/entrepeneurship");

        } catch(error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error al iniciar sesión");
            }        } finally {
            setLoading(false)
        }
    }

    return(
        <motion.div  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-screen flex">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-1/2 h-full">                
                <img src={Aston} alt="" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-[50%] flex flex-col items-center justify-center">
                <h1 className="text-4xl">Inicia sesión y empieza a crear...</h1>
                <form onSubmit={handleSumbit} className="w-1/2 bg-[#1A1A1A] flex flex-col gap-4 mt-16 rounded-md shadow-lg p-4">

                    <div className="flex flex-col gap-1">
                        <p className="text-2xl">Iniciar Sesión</p>
                        <p className="text-sm text-[#959595]">Inicia sesion en tu cuenta</p>    
                    </div>    


                    <div className="w-full flex flex-col gap-3">
                        <label className="text-sm">Nombre de usuario</label>
                        <input name="username" value={formData.username} onChange={handleChange} type="text" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa tu nombre de usuario..." required/>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <label className="text-sm">Contraseña</label>
                        <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa tu contraseña..." required />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="w-full rounded-md py-1 bg-[#2F76D2] mt-12 cursor-pointer">
                        {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
                    </button>
                </form>

            </motion.div>
        </motion.div>
    )
}