import Rating from "../../models/ratings.model.js"

export const getMyRating = async(req, res)=>{

    try {
        const isbn = req.params.isbn;
        const user = req.user;

        const myrating = await Rating.findOne({ ratedby : user.userid, bookid : isbn})

        if(!myrating || myrating.rating === 0){
            res.status(400).json({message : "Not rated by you"})
        }

        res.status(200).json(myrating)

    } catch (error) {
        res.status(400).json({message : "Server error"})
    }
}

export const rateBook = async(req, res)=>{
    try {
        const isbn = req.params.isbn;
        const {rating} = req.body;
        const user = req.user;

        const myrating = await Rating.findOne({ ratedby : user.userid, bookid : isbn})

        if(myrating){
            myrating.rating = rating;
            await myrating.save();
            res.status(200).json({newrating: myrating, message:"updated succesfully"})
        }

        const newRating = await Rating.create({ bookid:isbn, ratedby:user.userid, rating: rating})
        res.status(200).json({message:"added rating", newRating})

    } catch (error) {
        res.status(400).json({message: "Server error", error})
    }
}