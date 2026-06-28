import generateToken from "../../config/jwt.js";
import User from "../../models/users.model.js";

export const logIn = async (req, res) => {
    const { id, pass } = req.body;

    try {
        if (!id || !pass) {
            res.status(400).json({ message: "The above fields must be filled." })
        }
        const user = await User.findOne({ userid: id });

        if (user.password !== pass) {
            res.status(400).json("Incorrect password")
        }
        generateToken(id, res)
        res.status(200).json({ message: "logged in...", user })

    } catch (error) {
        res.status(400).json({ message: "Server error.." })
    }
}

export const logOut = async (req, res)=> {
    const user = req.user;
    try {
        if(user){
            res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })
        res.status(200).json({ message: "Logged out successsfully." })
        }
        else{
            res.status(400).json({message:"You need to login first"})
        }

    } catch (error) {
        res.status(400).json({ message: "Server error.." })
    }
}

export const getMe = async(req, res)=>{
    try {
        const userid = req.user.userid;

        const user = await User.findOne({userid : userid}).populate("cart.book");

        if(!user){
            res.status(400).json({message:"Not logged in"})
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({message:"server error"})
    }
}

export const signUp = async(req, res)=>{
    try {
        const {userid, userlocation, age} = req.body;
    
        if(!userid || !userlocation || !age){
            res.status(400).json({message:"Above fields must be registered"})
        }
    
        const existingusercheck = await User.findOne({userid : userid})
        if(existingusercheck){
            res.status(400).json({message : "Userid is already taken"})
        }
    
        const newuser = await User.create({
            userid : userid,
            userlocation : userlocation,
            age : age,
        })
        if(!newuser){
            res.status(400).json({message : "Registration failed.."})
        }
        res.status(200).json({newuser})
        
    } catch (error) {
        res.status(400).json({message:"Server error"})
    }
}