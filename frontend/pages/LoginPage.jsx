import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [userinfo, setUserinfo] = useState({ id: "", pass: "" });
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!userinfo.id || !userinfo.pass) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const log = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userinfo),
            });
            const res = await log.json();
            if (log.ok) {
                navigate("/");
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err) {
            setError("Server error. Try again.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
                <Link to="/" className="text-4xl font-extrabold text-gray-800 text-center block mb-6">
                    Bookworm
                </Link>

                <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">Log In</h1>

                {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

                <div className="flex flex-col gap-5">
                    {/* User ID */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder=" "
                            value={userinfo.id}
                            onChange={(e) => setUserinfo({ ...userinfo, id: e.target.value })}
                            className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                        <label
                            className={`absolute left-4 text-gray-400 text-sm transition-all
                                ${userinfo.id ? '-top-2 text-xs text-indigo-500' : 'top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-indigo-500 peer-focus:text-xs'}`}
                        >
                            User ID
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder=" "
                            value={userinfo.pass}
                            onChange={(e) => setUserinfo({ ...userinfo, pass: e.target.value })}
                            className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                        <label
                            className={`absolute left-4 text-gray-400 text-sm transition-all
                                ${userinfo.pass ? '-top-2 text-xs text-indigo-500' : 'top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-indigo-500 peer-focus:text-xs'}`}
                        >
                            Password
                        </label>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                        Log In
                    </button>

                    <p className="text-gray-500 text-center mt-2">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-500 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
