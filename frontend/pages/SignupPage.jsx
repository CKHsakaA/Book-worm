import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ userid: '', userlocation: '', age: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userid || !formData.userlocation || !formData.age) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center tracking-wide">Create Account</h2>

                {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* User ID */}
                    <div className="relative">
                        <input
                            type="text"
                            name="userid"
                            placeholder=" "
                            value={formData.userid}
                            onChange={handleChange}
                            className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                            required
                        />
                        <label className={`absolute left-4 text-gray-400 text-sm transition-all 
                            ${formData.userid ? '-top-2 text-xs text-yellow-500' : 'top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-yellow-500 peer-focus:text-xs'}`}>
                            User ID
                        </label>
                    </div>

                    {/* Location */}
                    <div className="relative">
                        <input
                            type="text"
                            name="userlocation"
                            placeholder=" "
                            value={formData.userlocation}
                            onChange={handleChange}
                            className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                            required
                        />
                        <label className={`absolute left-4 text-gray-400 text-sm transition-all 
                            ${formData.userlocation ? '-top-2 text-xs text-yellow-500' : 'top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-yellow-500 peer-focus:text-xs'}`}>
                            Location
                        </label>
                    </div>

                    {/* Age */}
                    <div className="relative">
                        <input
                            type="number"
                            name="age"
                            placeholder=" "
                            value={formData.age}
                            onChange={handleChange}
                            className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                            required
                        />
                        <label className={`absolute left-4 text-gray-400 text-sm transition-all 
                            ${formData.age ? '-top-2 text-xs text-yellow-500' : 'top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-yellow-500 peer-focus:text-xs'}`}>
                            Age
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-2xl font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-gray-600 mt-6 text-center">
                    Already have an account?{" "}
                    <span
                        className="text-yellow-600 cursor-pointer hover:underline font-medium"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
