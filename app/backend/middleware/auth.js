import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Grab the token from the request header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 2. Verify if the token is valid using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Inject the user data into the request object
    req.user = decoded; 
    
    // 4. Let the request pass through to your actual route logic
    next(); 
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};