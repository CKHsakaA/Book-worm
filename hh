<div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <div className="sticky top-0 z-50 shadow-md bg-white">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <h1 className="font-extrabold text-4xl text-gray-800 mb-6">
          Some books to start with
        </h1>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {books.map((book) => (
            <div
              key={book.ibsn}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Book Image */}
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={book?.img}
                  alt={book?.bktitle || "Book cover"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Book Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {book.bktitle}
                </h2>
                <p className="text-sm text-gray-600 mt-1 truncate">{book.author}</p>
                <p className="text-xs text-gray-500 mt-1">{book.publisher}</p>
                <p className="text-xs text-gray-400 mt-1">{book.yop}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


    <div className="">
                <Navbar />
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                <h1 className="font-semibold text-3xl p-2">Some books to start with</h1>
                <div className="grid grid-cols-6 gap-3">
                    {books.map(book => {
                        return (
                            <div>
                                <img src={book?.img} className="w-full h-78 object-cover rounded-xl" alt="http://example.com/image.jpg" />
                                <h1 key={book.ibsn}>{book.bktitle}</h1>
                                <h1>{book.author}</h1>
                                <h1>{book.yop}</h1>
                                <h1>{book.publisher}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>


            <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE: Scrollable list of books */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200">
          <h1 className="font-extrabold text-3xl text-gray-800 mb-6">
            Some books you can start with
          </h1>

          <div className="grid grid-cols-2 gap-5">
            {books && books.length > 0 ? (
              books.map((book, index) => (
                <div
                  key={index}
                  className="bg-white hover:bg-gray-100 transition rounded-xl shadow p-3 flex flex-col items-center text-center"
                >
                  <img
                    src={book.thumbnail || "/cover_not_found.jpg"}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-semibold text-gray-700 truncate w-full">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No books available.</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Basic static horizontal scroll sections */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-10">
          {/* Section 1 */}
          <div>
            <h2 className="font-bold text-2xl text-gray-700 mb-3">
              Books by Author 1
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3">
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book A
              </div>
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book B
              </div>
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book C
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-bold text-2xl text-gray-700 mb-3">
              Books by Author 2
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3">
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book X
              </div>
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book Y
              </div>
              <div className="min-w-[160px] bg-white rounded-lg shadow p-3">
                Book Z
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    export const getAuthorbks = async (req, res) => {
  try {
    const author = req.params.author;
    const normalizedQuery = author.replace(/[\s.]/g, "").toLowerCase();

    // Use a broad regex to get possible matches (case insensitive)
    const books = await Book.find({
      author: { $regex: normalizedQuery, $options: "i" }
    });

    // Further clean both sides for space, dot, and case insensitivity
    const filtered = books.filter(b => {
      const normalizedAuthor = (b.author || "").replace(/[\s.]/g, "").toLowerCase();
      return normalizedAuthor.includes(normalizedQuery);
    });

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books of this author found" });
    }

    res.status(200).json(filtered.slice(0, 20)); // limit to 20
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};



export const getAuthorbks = async (req, res)=>{
    const author = req.params.author;
    const normalizedQuery = author.replace(/[\s.]/g, "").toLowerCase();

    const books = await Book.find({author : { $regex: normalizedQuery.replace(/ /g, ""), $options: "i" }}).limit(20)


    const filtered = books.filter(b => {
      const normalizedAuthor = (b.author || "").replace(/[\s.]/g, "").toLowerCase();
      return normalizedAuthor.includes(normalizedQuery); // partial match allowed
    });

    try {
        if(books.length === 0){
            res.status("no books of this author found")
        }
        res.status(200).json(filtered.slice(0, 20));
    } catch (error) {
        res.status(400).json({message:"Error at getting books..."})
    }

}




<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <div className="sticky top-0 z-50 shadow-md bg-white">
        <Navbar />
      </div>

      {/* Book Info Section */}
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-4rem)]">
        {/* LEFT: Book Image */}
        <div className="w-full md:w-[40%] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-10">
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-out">
            <img
              src={bookinfo?.img || "/cover_not_found.jpg"}
              alt={bookinfo?.bktitle || "Book cover"}
              className="w-full h-[500px] object-cover"
              onError={(e) => (e.target.src = "/cover_not_found.jpg")}
            />
          </div>
        </div>

        {/* RIGHT: Book Details */}
        <div className="w-full md:w-[60%] bg-white p-10 flex flex-col justify-center shadow-inner">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            {bookinfo.bktitle}
          </h1>

          <p className="text-lg text-gray-600 italic mt-2">{bookinfo.author}</p>

          {/* Rating */}
          <div className="flex items-center mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < (bookinfo.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {bookinfo.rating ? `${bookinfo.rating.toFixed(1)} / 5` : "No ratings yet"}
            </span>
          </div>

          {/* Info tags */}
          <div className="flex flex-wrap gap-3 mt-6 text-sm text-gray-600">
            <span className="bg-gray-200 px-3 py-1 rounded-full">
              Publisher: <span className="font-semibold">{bookinfo.publisher || "Unknown"}</span>
            </span>
            <span className="bg-gray-200 px-3 py-1 rounded-full">
              Year: <span className="font-semibold">{bookinfo.yop || "N/A"}</span>
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed max-w-prose">
            {bookinfo.description ||
              "No description available for this book. Check back later for more details."}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
              Add to Cart 🛒
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
              Add to Favourites ❤️
            </button>
          </div>
        </div>
      </div>
    </div>





<div className="bg-gray-100">
            <div className="sticky top-0 z-50 shadow-md bg-white">
                <Navbar/>
            </div> 

            <div className="flex w-full h-screen">
                <div className="w-[60%] bg-white h-full">{bookinfo?.bktitle}</div>
                <div className="w-[40%] h-full">
                    <img src={bookinfo?.img} className="h-full w-full" alt="" />
                </div>
            </div>
        </div>





        <div className="flex items-center gap-3 mb-4">
  {myrating?.rating ? (
    <>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-3xl ${
              i < Math.round(myrating.rating / 2)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-700 font-semibold text-lg">
        ({(myrating.rating / 2).toFixed(1)}/5)
      </span>
    </>
  ) : (
    <span className="text-red-600 font-semibold text-lg">
      {myrating?.message || "Not rated yet"}
    </span>
  )}

  {!myrating?.rating && (
    <button className="ml-3 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
      Rate ⭐
    </button>
  )}
</div>



<div className="flex items-center gap-3 mb-4">
  {myrating?.rating ? (
    <>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const ratingValue = myrating.rating / 2;

          // Function to handle click
          const handleClick = () => {
            rateBook(starValue); // send 1-5
          };

          return (
            <span
              key={i}
              className="cursor-pointer text-3xl"
              onClick={handleClick}
            >
              {ratingValue >= starValue ? (
                <span className="text-yellow-500">★</span> // full star
              ) : ratingValue >= starValue - 0.5 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#FACC15"
                  viewBox="0 0 16 16"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
                </svg>
              ) : (
                <span className="text-gray-300">★</span> // empty star
              )}
            </span>
          );
        })}
      </div>

      <span className="text-gray-700 font-semibold text-lg">
        ({(myrating.rating / 2).toFixed(1)}/5)
      </span>
    </>
  ) : (
    <span className="text-red-600 font-semibold text-lg">
      {myrating?.message || "Not rated yet"}
    </span>
  )}
</div>



<div className="flex items-center gap-3 mb-4">
                                {myrating?.rating ? (
                                    <>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const starValue = i + 1;
                                                const ratingValue = myrating.rating / 2;

                                                return (
                                                    <span key={i} className="text-3xl">
                                                        {ratingValue >= starValue ? (
                                                            <span className="text-yellow-500">★</span> // full star
                                                        ) : ratingValue >= starValue - 0.5 ? (
                                                            <span><svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="#FACC15"
                                                                viewBox="0 0 16 16"
                                                                className="w-6 h-6 text-yellow-500"
                                                            >
                                                                <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
                                                            </svg></span> // half star (alternative shape)
                                                        ) : (
                                                            <span className="text-gray-300">★</span> // empty star
                                                        )}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <span className="text-gray-700 font-semibold text-lg">
                                            ({(myrating.rating / 2).toFixed(1)}/5)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-semibold text-lg">
                                        {myrating?.message || "Not rated yet"}
                                    </span>
                                )}

                                {!myrating?.rating && (
                                    <button className="ml-3 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                                        Rate ⭐
                                    </button>
                                )}
                            </div>
