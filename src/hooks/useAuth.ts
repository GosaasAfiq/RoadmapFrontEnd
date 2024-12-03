import { useEffect, useState } from "react";
import { useStore } from "../app/stores/store";

export const useAuth = () => {
    const { userStore } = useStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Load user from localStorage when the app starts
        userStore.loadUserFromLocalStorage();
        setIsAuthenticated(!!userStore.user);
        setLoading(false); // Set loading to false after user data is loaded
    }, [userStore]);

    const login = (user: any) => {
        userStore.setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        userStore.logout();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        user: userStore.user,
        login,
        logout,
        loading, // Return loading state
    };
};
