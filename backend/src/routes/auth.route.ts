import express from "express"
import { fetchMe, loginController, logoutController, signupController } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", protectRoutes, fetchMe);


export default router;