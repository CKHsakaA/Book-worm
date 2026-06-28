import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ setSearchresults, setSearchtoggle, setLoading }) => {
    const [logged, setLogged] = useState(false);
    const [cartitems, setCartitems] = useState([]);
    const [query, setQuery] = useState("");
    const [opencart, setOpencart] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const getMe = async () => {
        const res = await fetch("http://localhost:3000/api/auth/getme", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
            setLogged(true);
            setCartitems(data.cart);
        }
    };

    const handleLogout = async () => {
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "DELETE",
            credentials: "include",
        });
        setLogged(false);
        window.location.reload();
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            setSearchresults([]);
            setSearchtoggle(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setSearchtoggle(true);

        try {
            const res = await fetch(`http://localhost:3000/api/books/search/${query}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setSearchresults(res.ok ? data : []);
        } catch (err) {
            console.error(err);
            setSearchresults([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (itemid) => {
        const res = await fetch(`http://localhost:3000/api/books/removeitem/${itemid}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) setCartitems((prev) => prev.filter((item) => item._id !== itemid));
        setRefresh(!refresh);
    };

    useEffect(() => { getMe(); }, []);
    useEffect(() => { getMe(); }, [refresh]);

    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                {/* Logo */}
                <Link to="/" onClick={() => setSearchtoggle(false)} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 w-10 h-10">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-gray-800">Bookworm</h1>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 mx-6 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Search for books..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full py-3 pl-5 pr-13 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition placeholder-gray-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-gray-100 hover:bg-gray-200 text-white p-2 shadow-md transition"
                    >
                        🔍
                    </button>
                </div>

                {/* Buttons (Cart / Login / Signup / Logout) */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOpencart(true)}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25Z" />
                        </svg>
                        <span className="hidden sm:inline">Cart</span>
                    </button>

                    {logged ? (
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                to="/login"
                                className="py-2 px-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="py-2 px-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition"
                            >
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>


            {/* Cart Drawer */}
            {opencart && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setOpencart(false)}
                    />
                    <div className="fixed top-0 right-0 z-50 w-96 h-full bg-white p-6 shadow-2xl rounded-l-3xl overflow-y-auto flex flex-col transition-transform duration-300">
                        <button
                            className="absolute top-5 right-5 text-gray-700 hover:text-gray-900 text-2xl font-bold"
                            onClick={() => setOpencart(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">Your Cart</h2>

                        <div className="flex-1 flex flex-col gap-4">
                            {cartitems.map((item) => (
                                <Link
                                    to={`/getbookinfo/${item.book?.ibsn}`}
                                    key={item._id}
                                    className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-md hover:shadow-xl transition-all border border-blue-200 hover:border-blue-300"
                                >
                                    <div className="flex gap-4 items-center">
                                        <img
                                            src={item.book?.img}
                                            alt={item.book?.bktitle}
                                            className="w-16 h-20 object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition">{item.book?.bktitle}</h3>
                                            <p className="text-sm text-gray-500">Author: {item.book?.author}</p>
                                            <p className="text-sm text-gray-700">Qty: {item?.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-bold text-gray-900">$19.99</p>
                                        <button
                                            onClick={(e) => { e.preventDefault(); deleteItem(item._id); }}
                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm shadow-md transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold shadow-lg flex justify-center items-center gap-2 transition">
                            Checkout
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="7" cy="21" r="1" fill="#fff" />
                                <circle cx="17" cy="21" r="1" fill="#fff" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
