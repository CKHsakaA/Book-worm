import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    ibsn : {
        type : String,
    },
    bktitle : {
        type: String,
    },
    author :{
        type: String,
    },
    yop : {
        type : String,
    },
    publisher : {
        type : String,
    },
    img : {
        type : String,
        default : "https://cdnattic.atticbooks.co.ke/img/Z665993.jpg",
    }
})

const Book = mongoose.model("Book", booksSchema)

export default Book