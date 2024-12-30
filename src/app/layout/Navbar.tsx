import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { store, useStore } from "../stores/store";
import { useAuth } from "../../hooks/useAuth";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userStore,roadmapStore} = useStore();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);


    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setDropdownOpen(false);
        }
    };

    const handleLogout = async () => {

        if (user) {  

            roadmapStore.setFilterAllZero();
            const auditTrailData = {
                userId: user.id,  // Access the userId from the user object
                action: "User Logged out"
            };
    
            await store.auditTrailStore.create(auditTrailData);
    
            userStore.logout();
            navigate("/");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) return null;

    return (
        <nav className="bg-blue-600 shadow-lg sticky top-0 z-50"> {/* Sticky NavBar */}
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                {/* Left: Logo */}
                <div className="items-center space-x-3 hidden md:flex">
                    <a className="flex items-center space-x-3">
                        <img
                            src="/img/white-gosaas.png"
                            className="h-10"
                            alt="Logo"
                        />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="text-white md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={toggleMobileMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                                mobileMenuOpen
                                    ? "M6 18L18 6M6 6l12 12" // Close icon
                                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                            }
                        />
                    </svg>
                </button>

                {/* Center: Create and View Roadmaps */}
                <div className={`items-center space-x-4 ml-auto mr-8 hidden md:flex`}>
                    <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition">
                        <NavLink to="create" className="block">Create Roadmap</NavLink>
                    </button>
                    <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition">
                        <NavLink to="roadmaps" className="block">View Roadmaps</NavLink>
                    </button>
                </div>

                {/* Right: User Profile with Dropdown */}
                <div className={`relative items-center hidden md:flex`}>
                    <button
                        ref={buttonRef}
                        type="button"
                        className="flex items-center bg-blue-800 text-white rounded-full p-1 focus:ring-4 focus:ring-blue-300"
                        aria-expanded={dropdownOpen ? "true" : "false"}
                        onClick={toggleDropdown}
                    >
                        <img
                            className="w-10 h-10 rounded-full"
                            src={user?.image || "/img/user.png"}
                            alt="User"
                        />
                    </button>

                    {dropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                            style={{ top: "100%" }}
                        >
                            <ul className="py-2">
                                {user && user.username && (
                                    <li className="px-4 py-2 text-gray-700 font-semibold">
                                        {user.username} {/* Display the user's name */}
                                    </li>
                                )}
                                <li>
                                    <NavLink
                                        to="audittrail"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Audit Trail
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
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

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-blue-600">
                    <ul className="space-y-2 py-2 px-4">
                        <li>
                            <NavLink
                                to="create"
                                className="block text-white py-2 px-4 hover:bg-blue-700 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Create Roadmap
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="roadmaps"
                                className="block text-white py-2 px-4 hover:bg-blue-700 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                View Roadmaps
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="audittrail"
                                className="block text-white py-2 px-4 hover:bg-blue-700 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Audit Trail
                            </NavLink>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-white py-2 px-4 hover:bg-blue-700 rounded"
                            >
                                Log Out
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
});
