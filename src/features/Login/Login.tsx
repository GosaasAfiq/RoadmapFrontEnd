import { GoogleLogin } from "@react-oauth/google";
import { observer } from "mobx-react-lite";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

export default observer(function Login() {
    const { handleGoogleLogin } = useGoogleAuth();



    const handleSuccess = (credentialResponse: any) => {
        handleGoogleLogin(credentialResponse);        
    };

    const handleError = () => {
        console.error("Google Login Failed");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            <h1 className="absolute top-8 text-5xl font-bold text-gray-800">
                Login / Roadmaps
            </h1>
            <div className="bg-white w-1/2 h-[60vh] p-16 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
                <img
                    src="/black-gosaas.png"
                    alt="GoSaaS Logo"
                    className="h-16 w-auto relative top-2"
                />
                <div className="mt-20">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                    />
                </div>
            </div>
        </div>
    );
});
