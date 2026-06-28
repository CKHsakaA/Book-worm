import express from "express";
import { getMyRating, rateBook } from "../controllers/ratings.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/getmyrating/:isbn",protectRoute, getMyRating);
router.post("/rate/:isbn",protectRoute, rateBook);

export default router