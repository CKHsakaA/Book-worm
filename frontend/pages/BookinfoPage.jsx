import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";

export const BookinfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [myrating, setMyrating] = useState()
    const [bookinfo, setBookinfo] = useState()
    const { bookid } = useParams();
    const [refresh, setRefresh] = useState(false);
    const [islogged, setIslogged] = useState(false)
    const alertShown = useRef(false);


    console.log(bookid)

    const checkLogin = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/auth/getme", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok && !alertShown.current) {
            alertShown.current = true;
            alert("Please login to view this page.");
            navigate("/login");
            return;
        }
        setIslogged(true);
    } catch (error) {
        if (!alertShown.current) {
            alertShown.current = true;
            alert("Error checking login. Please login.");
            navigate("/login");
        }
    }
};


    const getBookinfo = async () => {
        const bookdata = await fetch(`http://localhost:3000/api/books/getbookinfo/${bookid}`, {
            method: "GET",
            credentials: "include",
        })
        const res = await bookdata.json()
        console.log(res)
        setBookinfo(res)
    }

    const getMyrating = async () => {
        const myrating = await fetch(`http://localhost:3000/api/ratings/getmyrating/${bookid}`, {
            method: "GET",
            credentials: "include",
        })
        const res = await myrating.json();
        console.log(res)
        setMyrating(res)
    }


    const rateBook = async (stars) => {
        try {
            const res = await fetch(`http://localhost:3000/api/ratings/rate/${bookid}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: stars * 2 }), // convert back to 1-10 scale
            });
            const data = await res.json();
            setMyrating(data); // update state to show new rating
            getMyrating();

        } catch (err) {
            console.error(err);
        }
    };

    const addtoCart = async () => {
        const add = await fetch("http://localhost:3000/api/books/addtocart", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ibsn: bookid,
                quantity: 1,
            })
        })
        const res = await add.json()
        if (res.success) {
            navigate(`/${bookid}`);
            // ✅ trigger a re-render
        }
    }


    
    useEffect(() => {
        getBookinfo()
        getMyrating()
    }, [])
    
    useEffect(() => {
    checkLogin();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="sticky top-0 z-50 shadow-md bg-white">
                <Navbar />
            </div>
    
            {/* Book Info Section */}
            <div className="flex flex-col md:flex-row bg-white rounded-b-3xl shadow-lg mt-4 mx-4 md:mx-10 p-6 gap-8">
                {/* Left Column */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-800 mb-2">{bookinfo?.bktitle}</h1>
                        <h2 className="text-xl md:text-2xl text-gray-600 mb-4">{bookinfo?.author}</h2>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const starValue = i + 1;
                                    const ratingValue = myrating?.rating ? myrating.rating / 2 : 0;

                                    return (
                                        <span
                                            key={i}
                                            className="cursor-pointer text-3xl hover:text-yellow-500 text-yellow-400"
                                            onClick={() => rateBook(starValue)}
                                        >
                                            {ratingValue >= starValue ? "★" : "☆"}
                                        </span>
                                    );
                                })}
                            </div>
                            {myrating?.rating && (
                                <span className="text-gray-700 font-semibold text-lg">
                                    ({(myrating.rating / 2).toFixed(1)}/5)
                                </span>
                            )}
                        </div>

                        {/* Publisher & Year */}
                        <div className="flex flex-col sm:flex-row gap-20 text-xl text-gray-700 mb-4">
                            <p><span className="font-semibold">Publisher:</span> {bookinfo?.publisher}</p>
                            <p><span className="font-semibold">Published:</span> {bookinfo?.yop}</p>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-gray-900">$19.99</span>
                            <span className="text-xl text-gray-400 line-through">$29.99</span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-md font-semibold">33% OFF</span>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={addtoCart}
                            className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg 
               hover:bg-green-600 transition-transform transform hover:scale-105 
               active:scale-95 active:shadow-inner inline-flex items-center gap-2"
                        >
                            Add to Cart
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25Z" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Column */}
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-96 md:h-[32rem] rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transform transition-transform duration-500">
                        <img
                            src={bookinfo?.img}
                            alt={bookinfo?.bktitle}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* You May Also Like */}
            <div className="mt-10 px-6 md:px-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">You May Also Like</h2>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {[1, 2, 3, 4, 5].map((item, idx) => (
                        <div
                            key={idx}
                            className="min-w-[200px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                            <div className="w-full h-40 overflow-hidden">
                                <img
                                    src=""
                                    alt="Book Cover"
                                    className="w-full h-full object-cover rounded-t-xl"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">Book Title</h3>
                                <p className="text-sm text-gray-600 truncate">Author</p>
                                <p className="text-xs text-gray-500">Publisher</p>
                                <p className="text-xs text-gray-400">Year</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookinfoPage