export interface AuditTrail {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
    user: {
        id: string;
        username: string;
        email: string;
        image: string;
    };
}
