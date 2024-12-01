import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after logout
import { useStore } from "../stores/store";

export default function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { userStore } = useStore();
    const navigate = useNavigate(); // Hook for navigation

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // Handle clicks outside of the dropdown and button
    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setDropdownOpen(false); // Close the dropdown
        }
    };

    // Handle logout
    const handleLogout = () => {
        userStore.logout(); // Clear user session
        navigate("/"); // Redirect to login page
    };

    useEffect(() => {
        // Add event listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-blue-600 shadow-lg">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                {/* Left: Logo */}
                <div className="flex items-center space-x-3">
                    <a href="/" className="flex items-center space-x-3">
                        <img
                            src="/img/white-gosaas.png"
                            className="h-10"
                            alt="Logo"
                        />
                    </a>
                </div>

                {/* Center: Create and View Roadmaps */}
                <div className="flex items-center space-x-4 ml-auto mr-8">
                    <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition">
                        Create
                    </button>
                    <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition">
                        View Roadmaps
                    </button>
                </div>

                {/* Right: User Profile with Dropdown */}
                <div className="relative flex items-center">
                    <button
                        ref={buttonRef} // Attach ref to the button
                        type="button"
                        className="flex items-center bg-blue-800 text-white rounded-full p-1 focus:ring-4 focus:ring-blue-300"
                        aria-expanded={dropdownOpen ? "true" : "false"}
                        onClick={toggleDropdown}
                    >
                        <img
                            className="w-10 h-10 rounded-full"
                            src="/img/user.png"
                            alt="User"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div
                            ref={dropdownRef} // Attach ref to the dropdown menu
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                            style={{
                                top: "100%", // Ensure it's positioned below the button
                            }}
                        >
                            <ul className="py-2">
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Audit Trails
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout} // Log out on click
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
