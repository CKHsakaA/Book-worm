import express from "express";
import {logIn, logOut, getMe, signUp} from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/login", logIn)
router.delete("/logout",protectRoute, logOut)
router.get("/getme",protectRoute, getMe)
router.post("/signup", signUp)

export default router