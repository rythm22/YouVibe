import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { clerkClient } from "@clerk/clerk-sdk-node";

export const protectRoute = ClerkExpressRequireAuth();

export const requireAdmin = async (req, res, next) => {
    try {
        const user = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === user.emailAddresses[0].emailAddress;

        if (!isAdmin) {
            return res.status(403).json({ message: "Unauthorized - you must be an admin" });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};