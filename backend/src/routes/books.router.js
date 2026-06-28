import express from "express";
import { addtoCart, removeItem, getAllBooks, getAuthorbks, getBookinfo, searchBooks, getTopRatedBooks} from "../controllers/books.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/getallbooks", getAllBooks);
router.get("/getauthorbks/:author", getAuthorbks)
router.get("/getbookinfo/:bookid", protectRoute, getBookinfo )
router.get("/search/:query", searchBooks);
router.post("/addtocart", protectRoute, addtoCart)
router.delete("/removeitem/:itemid", protectRoute, removeItem)
// router.get("/recommend", protectRoute, getRecommendation)
router.get("/popularbks", getTopRatedBooks)


export default router