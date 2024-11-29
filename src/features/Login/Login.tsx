export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            {/* "Sign In" text positioned just outside and closer to the top-left corner */}
            <h1 className="absolute top-4 left-4 right-1 bottom-1 text-4xl font-extrabold text-gray-800 tracking-wide ">
                Sign In
            </h1>



            {/* White box centered */}
            <div className="bg-white w-1/2 h-[60vh] p-16 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
                {/* Logo moved down a bit */}
                <img 
                    src="/black-gosaas.png" 
                    alt="GoSaaS Logo" 
                    className="h-16 w-auto relative top-2" // Move image down a bit
                />
                
                {/* Sign up button */}
                <button
                    type="button"
                    className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mt-20"
                >
                    <svg
                        className="mr-2 -ml-1 w-4 h-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                    </svg>
                    Sign up with Google
                </button>
            </div>
        </div>
    );
}
