const User = require('../models/User');
const createError = require('http-errors' );

module.exports = async(req,res,next)=>{
    try{
       const user = await User.findById(req.user.id);
       if(user.usertype !== "admin"){
          return next(createError(403, 'Only Admin Access'));

       }else{
        next();
       }

    }catch(error){
       console.log(error);
        return next(createError(500, 'Un-Authorization Access'));
    }
}