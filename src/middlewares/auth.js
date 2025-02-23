const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                error: true,
                message: 'Access Denied: No token provided'
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error)
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: true,
                message: 'Access token has expired'
            });
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: true,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            error: true,
            message: 'Internal server error during authentication'
        });
    }
};

module.exports = { authenticate };