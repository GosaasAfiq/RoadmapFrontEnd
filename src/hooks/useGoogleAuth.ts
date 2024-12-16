import { store } from "../app/stores/store";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;

            console.log("Google Credential Token:", token);

            // Send token to backend for validation
            const response = await fetch("http://localhost:5000/api/auth/google-response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ credential: token }),
            });
            
            

            if (!response.ok) {
                throw new Error("Failed to authenticate with Google");
            }

            const data = await response.json();
            const user = {
                id: data.id,
                username: data.username,
                email: data.email,
                token: data.token,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                image: data.image,
            };
            console.log("Real Credential Token:", data.token);

            // Save the user and redirect
            login(user);
            console.log("Redirecting to /roadmaps"); // <-- Added log
            //HERE
            const auditTrailData = {
                userId: user.id,  // Access the userId from the user object
                action: "User logged in"
            };

            // await store.auditTrailStore.create(auditTrailData);

            

            navigate("/roadmaps");
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    return {
        handleGoogleLogin,
    };
};
