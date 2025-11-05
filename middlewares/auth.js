const  JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports= (req,res,next)=>{
    try {
        const authorization = req.headers['authorization'];

        if(!authorization){
           return next(createError(401,'Authorization Header Missing'));
        }
        
        const token = authorization.split(' ')[1];
         if (!token) {
            return next(createError(401, 'Token not provided'));
        }

        const decoded = JWT.verify(token,process.env.JWT_SECRET);
        req.user = { id: decoded.id };

         next();
        
    } catch (error) {
           return next(createError(401,'Invalid or expired token'));
    }

}