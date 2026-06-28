import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userid : {
        type : String,
    },
    userlocation : {
        type: String,
    },
    age : {
        type: String,
    },
    password : {
        type : "String",
        default : "123",
    },
    cart : [{
        book : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book", // reference to Book model
                required: true,
            },
        quantity : {type: Number},
    },
]
})

const User = mongoose.model("User", userSchema)

export default User