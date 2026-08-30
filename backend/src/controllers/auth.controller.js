import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username y password son requeridos"
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "El usuario ya existe"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error al registrar usuario"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username y password son requeridos"
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales inválidas"
            });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Credenciales inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error al iniciar sesión"
        });
    }
};