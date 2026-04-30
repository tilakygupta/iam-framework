const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

 const authHeader = req.headers.authorization;

 console.log('AUTH HEADER:', authHeader);

 if(!authHeader){
   return res.status(401).json('No Token');
 }

 try{

   const token = authHeader.replace('Bearer ','').trim();

   console.log('TOKEN:', token);

   const decoded = jwt.verify(
      token,
      'mysecretkey'
   );

   console.log('DECODED:', decoded);

   req.user = decoded;

   next();

 }catch(err){

   console.log('JWT ERROR:', err.message);

   return res.status(403).json('Invalid Token');

 }

}
