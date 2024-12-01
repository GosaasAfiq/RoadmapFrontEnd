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
            const response = await fetch(`http://localhost:5000/api/auth/google-response?credential=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
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
            };

            // Save the user and redirect
            login(user);
            console.log("Redirecting to /roadmaps"); // <-- Added log

            navigate("/roadmaps");
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    return {
        handleGoogleLogin,
    };
};
