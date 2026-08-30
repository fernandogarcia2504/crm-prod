import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Token no proporcionado"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token invalido o expirado"
        });

    }

};

// Verifica el token del portal de cursos (empleados/trainees), separado
// del verifyToken de arriba que es solo para usuarios staff del CRM.
export const verifyEmployeeToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Token no proporcionado"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "trainee") {

            return res.status(403).json({
                message: "Token no valido para el portal de cursos"
            });

        }

        req.employee = {
            id: decoded.id
        };

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token invalido o expirado"
        });

    }

};