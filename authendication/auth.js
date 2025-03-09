const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    console.log(req.headers);
    
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token ",token);
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = jwt.decode(token);
        console.log(decodedToken);
         
        req.user = decodedToken; 
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token', error });
    }
};

module.exports = verifyToken;
