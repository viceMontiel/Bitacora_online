import { Router } from "express";
import {
    createUser,
  getUsers,
  getUser,
  login,
  profile
} from "../controllers/users.controllers.js";
import { verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// get all users
router.get("/users", getUsers);
// get an user
router.get("/users/:id", verifyToken, getUser);
//insert an user (register)
router.post("/users/register", createUser);
//login
router.post("/users/login", login);
//profile
router.get("/users/profile", verifyToken, profile);

export default router;