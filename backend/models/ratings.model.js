import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    bookid : {
        type : String,
    },
    ratedby : {
        type : String,
    },
    rating : {
        type : Number,
        max : 10,
        min : 0,
        default : null,
    }
})

const Rating = mongoose.model("Rating", ratingSchema)

export default Rating