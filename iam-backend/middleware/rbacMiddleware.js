function checkPermission(permission){
return(req,res,next)=>{
if(
req.user.permissions &&
req.user.permissions.includes(permission)
){
next();
}else{
res.status(403).json('Access Denied');
}
}
}

module.exports=checkPermission;