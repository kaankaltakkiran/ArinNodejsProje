//Oluşturduğumuz Schemayı İmport Ettim
import User from "../models/userModel.js";
//Şifreleme İçin Bcrypt
import bcrypt from "bcrypt";
//Yetki İçin
import jwt from "jsonwebtoken";
//Photo Gönderdik Dashboarda    
import Photo from "../models/photoModel.js";

//Kullanıcı Oluşturma
//Async Yapıyoruz Çünkü Beklemio
const createUser= async(req,res)=>{
    try {
        //FrontEnde İstek Gitmesi Lazım
    //reqbody İstek
const user=await User.create(req.body);
//Önce Status Kod Gönderdim.Oluştrduk Anlamında
//Json Formatında Gönderdim
/* //Login Olunca Login Sayfasına Git
res.redirect("/login"); */
res.status(201).json({user:user._id});
    } catch (error) {
      
        //Boş Bir Error Nesnesi
        let errors2={};
        
        if(error.code===11000){
            errors2.email="Bu Email İle Kayıt Olunmuş";
        }

        //Eğer Error ValidationError İse Obje Key ilişkisi İle Eror Mesajları Dön
        if(error.name=="ValidationError"){
            Object.keys(error.errors).forEach((key)=>{
                errors2[key]=error.errors[key].message;
            });
        }

        res.status(400).json(errors2);
    }
};

//Login Kısmı
//Async Yapıyoruz Çünkü Beklemio
const loginUser= async(req,res)=>{
  try{
//Username Ve Password Karşılaştırma Yapma Yeri
//Username Ve Password Aldım
const {username,password}=req.body;
//Veritabanından Kullanıcı Bulma
//Usernamee Göre Bulma(uniqe)
//Await Beklemesi Lazım Bulmaması İçin
const user= await User.findOne({username:username});
//Şifrelerin Eşit olup Olmadığı Durum İçin
let same=false;

if(user){
   
    //Burdaki Password İle Veritabanındaki Passwordü Karşılaştırma
    //Compare Karşılaştırma Yapıo
    //1.Parametre Formdaki Password,2.Veritabanındaki
    same=await bcrypt.compare(password,user.password);
    //Else Kullanıcı Yoksa
}else{
    //Return Sebebi Kullanıcı Yoksa Şifrelerin Aynı Olup Olmaması Önemli Değil.
  return  res.status(401).json({
        succeded:false,
        error:"Kullanıcı Yok.",
      });
}

//Passwordler Eşlendiyse İfe Girer
if(same){
     //Token Oluşturma
     const token=createToken(user._id)
     //Cokie Kaydetme
     res.cookie("jwt",token,{
        //Http Sayfalarda Kullanma
     httpOnly:true,
     //Bir Gün
     maxAge:1000*60*60*24,
     });
     //Token Eşleştiyse
    res.redirect('/users/dashboard');
    //Şifreler Eşlenmemiş Elsde
}else{
    res.status(401).json({
        succeded:false,
        error:"Password Eşleşmedi.",
      });
}

    } catch (error) {
        res.status(500).json({
          succeded:false,
          error,
        });
    }
};

//Yetki İçin
const createToken=(userId)=>{
    //Token Oluşturma
    //1.İd Alcak 2. Private Key (Env Dosyasında)
    return jwt.sign({userId},process.env.JWT_SECRET,{
    //Token Sonlanma
    expiresIn:'1d',

    });
};

//Dashboard Sayfası
const getDashBoardPage= async(req,res)=>{
    //Giriş Yapan Kullanıcıya Ait Photları Getir
    const photos=  await Photo.find({user:res.locals.user._id})
    //Kullanıcı Da Yolluyoruz
    //_İd Giriş Yapan Kullanıcıya Ait OLcak
    //2 Alan İçin Populate
    const user=await User.findById({_id:res.locals.user._id}).populate(['followers','followings']);
    res.render("dashboard",{
        link:'dashboard',
    photos,
    user,
    });
    };

//Userları Sırlayacak
const getAllUsers= async (req,res)=>{
    try {
        //Userları Bulmak İçin Find,{} Boş Obje
        //Giriş Yapan Kullanıcı Gösterme
       const users=await User.find({_id:{$ne:res.locals.user._id}});
       //Hem Userları Sayfasını Render Et Hemde Userları Gönder
       res.status(200).render("users",{
        users,
        link:'users',
       });
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
    }
}

//Ayrı Ayrı User Sayfası
const getAUser= async (req,res)=>{
    try {
        //Veritabanındaki İd İle Url Deki İd
       const user=await User.findById({_id:req.params.id});
         //Localdeki İd İle Userın Followrstaki İd varsa 
         //Login İle Karşılaştırma Varsa Unfllow Yoksa Follow
         const inFollowers=user.followers.some((follower)=>{
            return follower.equals(res.locals.user._id)
         });
         

       //Hem User Sayfasını Render Et Hemde User Gönder
       //Photo Gönderme
       //O Anki Kullanıcıyı Göster
       const photos=await Photo.find({user:user._id});
       res.status(200).render("user",{
        user,
        photos,
        link:'user',
        inFollowers,
       });
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });       
    }
}

//Follow Metodu
const follow= async (req,res)=>{
    try {
        //Giriş Yapan Kullanıcı res.locals.user._id
        //Takip Edecek Veya Çıkacak
        //Pushla Takibi
        //New De Update Et
       let user=await User.findByIdAndUpdate({_id:req.params.id},{$push:{followers:res.locals.user._id}},{new:true});

       //Kendimizi De Güncelliyoruz
       user=await User.findByIdAndUpdate({_id:res.locals.user._id},{$push:{followings:req.params.id}},{new:true});
        //Reflesh Edip Unfllow Follow Çıkıo
       res.status(200).redirect(`/users/${req.params.id}`);
    
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
          
    }
}

//UnFollow Metodu
const unFollow= async (req,res)=>{
    try {
        //Giriş Yapan Kullanıcı res.locals.user._id
        //Takip Edecek Veya Çıkacak
        //Pull GeriÇek Takibi
        //New De Update Et
       let user=await User.findByIdAndUpdate({_id:req.params.id},{$pull:{followers:res.locals.user._id}},{new:true});

       //Kendimizi De Güncelliyoruz
       user=await User.findByIdAndUpdate({_id:res.locals.user._id},{$pull:{followings:req.params.id}},{new:true});
        //Reflesh Edip Unfllow Follow Çıkıo
       res.status(200).redirect(`/users/${req.params.id}`);

    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
          
    }
}

//Başka Dosyalarda Kullanmak İçin Export
export {createUser,loginUser,getDashBoardPage,getAllUsers,getAUser,follow,unFollow};