import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import { UserModel } from '../models/users.model.js'
import { securityConfig } from "../config.js";
import { pool } from '../database/connection.database.js';

export const getUsers = async (req, res) => {

    try {
        const [rows] = await pool.query("SELECT * FROM usuario");
        res.json(rows);
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
      }
};

export const getUser = async (req, res) => {
  try {
      console.log(req.email)
        const user = await UserModel.findOneByEmail(req.email)
        console.log('Headers:', req.headers); // Revisar los encabezados
      if (!user) {
          return res.status(409).json({ ok: false, msg: "No exists" })
      }
      return res.status(201).json({ ok: true, msg: user })

  } catch (error){}
};


export const createUser = async (req, res) => {
    try {
        console.log('Headers:', req.headers); // Revisar los encabezados

        console.log('Request body:', req.body); // Log para depurar

      if (!req.body) {
        return res.status(400).json({ ok: false, msg: "Request body is missing" });
      }
      console.log(req.body);
      const { name, last_name, email, password } = req.body;
  
      if (!name || !last_name || !email || !password) {
        return res.status(400).json({ ok: false, msg: "Missing required fields: email, password, username, etc." });
      }
      const user = await UserModel.findOneByEmail(email)
      if (user) {
          return res.status(409).json({ ok: false, msg: "Email already exists" })
      }
      //hashing password with BCRYPT: 10 salt and 10 hr to expire
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)

      //creating a new user
      const newUser = await UserModel.create({ email, password: hashedPassword, name, last_name })

      //creating a token to the session
      const token = jwt.sign({ email: newUser.email },
        securityConfig.jwtSecret,
          {
              expiresIn: securityConfig.tokenExpiration
          }
      )
      return res.status(201).json({ ok: true, msg: token })
  } catch (error) {
      console.log(error)
      return res.status(500).json({
          ok: false,
          msg: 'Error server'
      })
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validación de entrada
      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields: email, password" });
      }
  
      // Buscar usuario por email
      const user = await UserModel.findOneByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Comparar contraseña
      const isMatch = await bcryptjs.compare(password, user.contrasena); 
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Generar token JWT
      const token = jwt.sign(
        { email: user.correo, id: user.id }, // Asegúrate de usar las columnas correctas de la base de datos
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );
  
      // Respuesta exitosa
      return res.json({ ok: true, token });
  
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ ok: false, msg: 'Server error' });
    }
  };


export const profile = async (req, res) => {
  try {
    console.log(req.email)
      const user = await UserModel.findOneByEmail(req.email)
      console.log('Headers:', req.headers); // Revisar los encabezados
    if (!user) {
        return res.status(409).json({ ok: false, msg: "No exists" })
    }
    return res.status(201).json({ ok: true, msg: user })

  } catch (error) {
      console.error("Error al obtener el perfil:", error);
      return res.status(500).json({
          ok: false,
          msg: 'Error server'
      });
  }
};
