export interface User {
    id: string;
    username: string;
    email: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    token: string; // JWT token to manage authenticated sessions
}
