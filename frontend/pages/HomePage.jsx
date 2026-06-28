import Navbar from "../components/Navbar.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [popularbooks, setPopularbooks] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchresults, setSearchresults] = useState([]);
    const [searchtoggle, setSearchtoggle] = useState(false);
    const [authors] = useState(["J. K. Rowling", "Stephen King", "George Orwell"]);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [recommendedbooks, setRecommendedbooks] = useState([])
    const [islogged, setIslogged] = useState(false)

    const getBooks = async () => {
        const res = await fetch("http://localhost:3000/api/books/getallbooks", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        setBooks(data);
    };

    const getPopularbooks = async () => {
        const res = await fetch("http://localhost:3000/api/books/popularbks", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        console.log(data)
        setPopularbooks(data);
    };

    const getAuthorBooks = async () => {
        try {
            const results = [];
            for (const author of authors) {
                const res = await fetch(
                    `http://localhost:3000/api/books/getauthorbks/${encodeURIComponent(author)}`
                );
                const data = await res.json();
                results.push({ author, books: data });
            }
            setAuthorBooks(results);
        } catch (error) {
            console.error(error);
        }
    };

    const getRecommendBooks = async () => {
        const get = await fetch(`http://localhost:3000/api/books/recommend`, {
            method: "GET",
            credentials: "include",
        })
        const data = await get.json()
        console.log(data)
        setRecommendedbooks(Array.isArray(data) ? data : []);
    }

    const getMe = async () => {
        const res = await fetch("http://localhost:3000/api/auth/getme", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
            setIslogged(true);
        }
    };

    useEffect(() => {
        getBooks();
        getAuthorBooks();
        getRecommendBooks();
        getPopularbooks();
        getMe();
    }, []);

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            {/* Navbar */}
            <div className="sticky top-0 z-50 shadow-md bg-white">
                <Navbar
                    setSearchresults={setSearchresults}
                    setSearchtoggle={setSearchtoggle}
                    setLoading={setLoading}
                />
            </div>

            {/* Hero Banner */}
            {!searchtoggle && (
                <div className="w-full h-64 sm:h-96 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-b-3xl mb-6 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071" // replace with your banner image
                        alt="Banner"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">
                            Discover Your Next Favorite Book
                        </h1>
                        <p className="text-lg sm:text-xl drop-shadow-md">
                            Explore bestsellers, classics, and hidden gems.
                        </p>
                    </div>
                </div>
            )}

            {/* Search Results */}
            {searchtoggle ? (
                <div className="flex justify-center p-6">
                    <div className="w-full max-w-7xl">
                        {loading ? (
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Loading...</h1>
                        ) : searchresults.length === 0 ? (
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">No results found</h1>
                        ) : (
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Search Results</h1>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchresults.map((book) => (
                                <Link
                                    to={`/getbookinfo/${book.ibsn}`} //
                                    key={book.ibsn}
                                    className="bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                                >
                                    <div className="h-64 w-full overflow-hidden">
                                        <img
                                            src={book.img}
                                            alt={book?.bktitle || "Book cover"}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <h2 className="text-lg font-semibold text-gray-800 truncate">{book.bktitle}</h2>
                                        <p className="text-sm text-gray-600 mt-1 truncate">{book.author}</p>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{book.publisher}</p>
                                        <p className="text-xs text-gray-400 mt-auto">{book.yop}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row w-full p-6 gap-6 max-w-7xl mx-auto">
                    {/* Left - Books */}
                    <div className="flex-1 overflow-y-auto space-y-8">
                        {/* Recommended Section */}

                        {islogged ? (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Books you may like(model)</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {recommendedbooks.map((rbook) => {
                                        return (
                                            <Link
                                                to={`/getbookinfo/${rbook.ibsn}`}
                                                key={rbook.ibsn}
                                                className="bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group relative"
                                            >
                                                <div className="h-64 w-full overflow-hidden">
                                                    <img
                                                        src={rbook.img}
                                                        alt={rbook?.bktitle || "Book cover"}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <h2 className="text-lg font-semibold text-gray-800 truncate">{rbook.bktitle}</h2>
                                                    <p className="text-sm text-gray-600 mt-1 truncate">{rbook.author}</p>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{rbook.publisher}</p>
                                                    <p className="text-xs text-gray-400 mt-auto">{rbook.yop}</p>
                                                </div>

                                                {/* Quick action overlay */}
                                                <button className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 text-white font-semibold flex items-center justify-center transition-opacity duration-300">
                                                    View Details
                                                </button>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Books</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {popularbooks.map((book) => (
                                        <Link
                                            to={`/getbookinfo/${book.ibsn}`}
                                            key={book.ibsn}
                                            className="bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group relative"
                                        >
                                            <div className="h-64 w-full overflow-hidden">
                                                <img
                                                    src={book.img}
                                                    alt={book?.bktitle || "Book cover"}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <h2 className="text-lg font-semibold text-gray-800 truncate">{book.bktitle}</h2>
                                                <p className="text-sm text-gray-600 mt-1 truncate">{book.author}</p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{book.publisher}</p>
                                                <p className="text-xs text-gray-400 mt-auto">{book.yop}</p>
                                            </div>

                                            {/* Quick action overlay */}
                                            <button className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 text-white font-semibold flex items-center justify-center transition-opacity duration-300">
                                                View Details
                                            </button>
                                        </Link>

                                    ))}
                                </div>
                            </>
                        )}


                        {/* Popular Authors Section */}
                        <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-4">Popular Authors</h2>
                        {authorBooks.map((authorbk) => (
                            <div key={authorbk.author} className="mb-6">
                                <h3 className="font-semibold text-xl mb-3">{authorbk.author}</h3>
                                <div className="flex gap-5 overflow-x-auto pb-3">
                                    {authorbk.books.map((bk) => (
                                        <Link
                                            to={`/getbookinfo/${bk.ibsn}`}
                                            key={bk.ibsn}
                                            className="bg-white w-40 rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col overflow-hidden group relative"
                                        >
                                            <div className="h-40 w-full overflow-hidden">
                                                <img
                                                    src={bk?.img}
                                                    alt={bk?.bktitle || "Book cover"}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-3 flex flex-col flex-1">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{bk.bktitle}</h4>
                                                <p className="text-xs text-gray-600 mt-1 truncate">{bk.author}</p>
                                            </div>

                                            <button className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 text-white font-semibold flex items-center justify-center transition-opacity duration-300">
                                                View Details
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
