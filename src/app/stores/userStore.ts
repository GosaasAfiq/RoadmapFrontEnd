import { makeAutoObservable } from "mobx";
import { User } from "../models/user";

export default class UserStore {
    user: User | null = null;  // Store user information here

    constructor() {
        makeAutoObservable(this);
    }

    // Check if user is logged in
    get isLoggedIn() {
        return !!this.user;
    }

    // Set the user when they log in (e.g., after successful Google OAuth)
    setUser = (user: User) => {
        this.user = user;
        // You can also store the user data in localStorage or sessionStorage if needed
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("appToken", user.token); // Store the token as well
    };

    // Handle user logout
    logout = () => {
        this.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("appToken");
    };

    // Optionally, load user from localStorage (useful for refreshing the page)
    loadUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        }
    };
}
