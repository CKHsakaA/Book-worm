import jwt from "jsonwebtoken";
import User from "../../models/users.model.js";

export const protectRoute = async(req, res, next)=>{

    try {
        const token = req.cookies.jwt;
         if(!token){
            return res.status(400).json({message:"Not authorized..."})
         }

         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         req.user = await User.findOne({ userid : decoded.userId })

        if(!req.user){
             returnres.status(400).json({message:"user not found...", error})
        }

         next();    

    } catch (error) {
        return res.status(400).json({message: "Server error hello...", error})
    }

}

export default protectRoute