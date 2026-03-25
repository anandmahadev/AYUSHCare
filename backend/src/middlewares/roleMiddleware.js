/**
 * Role-based Access Control Middleware
 * Checks if the logged-in user has the required role to access a route.
 */

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // Assuming user role is attached to the request object via an auth middleware
        // Typically req.user.role
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action'
            });
        }
        next();
    };
};

module.exports = { restrictTo };
