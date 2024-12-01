import { useEffect, useState } from "react";
import { useStore } from "../app/stores/store";

export const useAuth = () => {
    const { userStore } = useStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for user data in localStorage on mount
        userStore.loadUserFromLocalStorage();
        setIsAuthenticated(!!userStore.user);
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
    };
};
