import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verifyToken = (req, res, next) => {
    // Obtener el token del encabezado 'Authorization'
    let token = req.headers.authorization;
    console.log("Token recibido 1:", token);

    // Si no se proporciona el token, devolver un error 401
    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    // Dividir el token (debe ser en el formato 'Bearer <token>')
    token = token.split(" ")[1];

    // Mostrar el token para depuración
    console.log("Token recibido 2:", token);

    try {
        // Verificar el token usando jwt.verify
        const { email } = jwt.verify(token, JWT_SECRET);
        
        // Si es válido, agregar el email al objeto req
        req.email = email;

        // Continuar con la siguiente función del middleware
        next();
    } catch (error) {
        // Si ocurre un error, manejarlo de manera detallada
        console.error("JWT Error:", error);

        // Si el error es por un token expirado, proporcionar un mensaje específico
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        // Para otros errores de JWT, indicar que el token es inválido
        return res.status(400).json({ error: "Invalid token" });
    }
};
