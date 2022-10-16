//Userlar İçin
import User from "../models/userModel.js";
//Yetki İçin
import jwt from "jsonwebtoken";

//Kullanıcı Bilgilerile Ulaşma
const checkUser=async(req,res,next)=>{
  //Token Alma
  const token=req.cookies.jwt;
  if(token){
    //Tokeni Al
   jwt.verify(token,process.env.JWT_SECRET, async (err,decodedToken)=>{
    //Hata Olursa
    if(err){
      console.log(err.message);
      res.locals.user=null;
      next();
    }else{
     const user=await User.findById(decodedToken.userId);
     res.locals.user=user;
     next();
    }
   });
 }else{
  //Token Yoksa
  res.locals.user=null;
      next();
 }
}

const authenticateToken = async (req, res, next) => {

    try {
      //Tokeni Cookieden Aldım
  const token=req.cookies.jwt;
    if(token){
      //Tokeni Al
      jwt.verify(token,process.env.JWT_SECRET,(err)=>{
        //Hata Alırsa Mesajı Yazdır Ve Anasayfaya Yolla
        if(err){
          console.log(err.message);
          res.redirect("/login");
        }else{
          next();
        }
      });
    }else{
      res.redirect("/login");
    }

    } catch (error) {
        res.status(401).json({
            succeeded:false,
            error:"Hatalı Token"
        })
    }
};

export { authenticateToken,checkUser};