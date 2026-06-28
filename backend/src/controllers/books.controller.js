import Book from "../../models/books.model.js";
import User from "../../models/users.model.js";
import Rating from "../../models/ratings.model.js"

export const getAllBooks = async (req, res) => {

    const books = await Book.find().limit(20)

    try {
        if (!books) {
            res.status("error getting books")
        }
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ message: "Error at getting books..." })
    }

}

export const getAuthorbks = async (req, res) => {
    const author = req.params.author;

    const books = await Book.find({ author: author }).limit(20)

    try {
        if (books.length === 0) {
            res.status("no books of this author found")
        }
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ message: "Error at getting books..." })
    }

}

export const getBookinfo = async (req, res) => {
    try {
        const bookid = req.params.bookid;

        const book = await Book.findOne({ ibsn: bookid });
        if (!book) {
            res.status(400).json({ message: "No such books" })
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ message: "server error..." })
    }
}

export const searchBooks = async (req, res) => {
    try {
        const query = req.params.query; // get search string from /api/books/search/:query
        if (!query) return res.status(400).json({ message: "Query is required" });
        console.log("query controller");
        // Normalize query: lowercase, remove spaces and dots
        const normalizedQuery = query.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
        console.log(normalizedQuery);
        // Fetch all books (or you can add .limit(100) to limit results)
        const books = await Book.find();

        // Filter in JS: space/dot insensitive & partial match
        const filteredBooks = books.filter((b) => {
            const normalize = (str) => str.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
            return (
                normalize(b.bktitle).includes(normalizedQuery) ||
                normalize(b.author).includes(normalizedQuery) ||
                normalize(b.publisher).includes(normalizedQuery)
            );
        });

        res.status(200).json(filteredBooks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const addtoCart = async (req, res) => {
    try {
        const userid = req.user.userid;
        const { ibsn, quantity } = req.body;


        const user = await User.findOne({ userid: userid });
        const book = await Book.findOne({ ibsn: ibsn })

        if (!user) {
            res.status(400).json({ message: "Not authorized" })
        }
        user.cart.push({ book: book, quantity: quantity || 1 })


        await user.save();
        res.status(200).json({ message: "Book added successfull to cart", cart: user.cart })

    } catch (error) {
        res.status(400).json({ message: "Server error" })
    }
}

export const removeItem = async (req, res) => {
    try {
        const userid = req.user.userid;  // logged-in user (from token)
        const itemid = req.params.itemid;     // book identifier

        const user = await User.findOne({ userid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // filter out the item with this IBSN
        const initialLength = user.cart.length;
        user.cart = user.cart.filter(item => item._id.toString() !== itemid);

        if (user.cart.length === initialLength) {
            return res.status(404).json({ message: "Book not found in cart" });
        }

        await user.save();
        res.status(200).json({ message: "Book removed from cart", cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// export const getRecommendation = async (req, res) => {
//     try {
//         const userid = req.user.userid.toString();
//         const n = 10;
//         const response = await fetch(`http://127.0.0.1:5000/recommend/${userid}`,{
//             method : "GET",
//             credentials : "include",
//         });
//         const data = await response.json()
//         console.log(data)
//         if (!data || data.length === 0) {
//             res.status(400).json({ message: "No book to recomend" })
//         }
//         res.status(200).json(data)
//     } catch (error) {
//         res.status(400).json({ message: "Server error"})
//     }
// }

export const getTopRatedBooks = async (req, res) => {
  try {
    
    const topRatings = await Rating.find({ rating: 10 }).limit(100);

    const bookIds = [...new Set(topRatings.map(r => r.bookid))];

    if (bookIds.length === 0) {
      return res.status(404).json({ message: 'No books found with rating 10' });
    }

    // 3. Fetch books with those IDs
    const books = await Book.find({ ibsn: { $in: bookIds } });

    // 4. Return the result
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


