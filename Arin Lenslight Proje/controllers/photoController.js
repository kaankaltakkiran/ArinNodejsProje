//Oluşturduğumuz Schemayı İmport Ettim
import Photo from "../models/photoModel.js";
//Photo Upload İçin
import {v2 as cloudinary} from "cloudinary";
//Templeri Silmek İçin
import fs from "fs";
//Photoları Oluşturma
//Async Yapıyoruz Çünkü Beklemio
const createPhoto= async(req,res)=>{

    const result=await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename:true,
            folder:"lenslight_Tr",
        }
    );
   
    try {
  //FrontEnde İstek Gitmesi Lazım
    //reqbody İstek
    await Photo.create({
        name: req.body.name,
        description: req.body.description,
        user: res.locals.user._id,
         url: result.secure_url,
         //Silme İçim
        image_id: result.public_id,  
      });
      //Photolaro Silme(Temp)
       fs.unlinkSync(req.files.image.tempFilePath);

//Önce Status Kod Gönderdim.Oluştrduk Anlamında
//Json Formatında Gönderdim
res.status(201).redirect("/users/dashboard");

    } catch (error) {
        res.status(500).json({
          succeded:false,
          error,
        });
    }
};

//Photoları Sırlayacak
const getAllPhotos= async (req,res)=>{
    try {
        //Photoları Bulmak İçin Find,{} Boş Obje
        //Tüm Photo Sayfasında Görmesin Diye Fililtre $ne Değilse Demek
        //Local de Kullanıcı Varsa Fliltrele
       const photos=res.locals.user
       ? await Photo.find({user:{$ne:res.locals.user._id}})
        //Kullanıcı Yoksa Flitlreleme Yapma
       :await Photo.find({});

       //Hem Photps Sayfasını Render Et Hemde Photosları Gönder
       res.status(200).render("photos",{
        photos,
        link:'photos',
       });

    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
    }
}

//Ayrı Ayrı Foto Sayfası
const getAPhoto= async (req,res)=>{
    try {
        //Veritabanındaki İd İle Url Deki İd
        //Popılate UserName Getirio
       const photo=await Photo.findById({_id:req.params.id}).populate('user');
       //Giriş Yapan Kullanıcı Görsün
       let isOwner = false;

       if (res.locals.user) {
         isOwner = photo.user.equals(res.locals.user._id);
       }
       //Hem Photps Sayfasını Render Et Hemde Photosları Gönder
       res.status(200).render("photo",{
        photo,
        link:'photos',
        isOwner,
       });
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });        
    }
}

//Photo Silme
const deletePhoto= async (req,res)=>{
    try {
        //Hangi Photo
        const photo=await Photo.findById(req.params.id)
        //Veritabanındaki Photo İd Al
        const photoId=photo.image_id;
        //Cloudinaryden Silme
        await cloudinary.uploader.destroy(photoId)
         //Veritabanından Silme
        await Photo.findByIdAndRemove({_id:req.params.id})
        //Sildikten Sonra Bu Sayfaya Git 
        res.status(200).redirect("/users/dashboard");
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
          
    }
}

//Photo Update
const updatePhoto= async (req,res)=>{
    try {
        //Hangi Photo
        const photo=await Photo.findById(req.params.id)
        //Eğer Photo Seçildiyse
        if(req.files){
         //Veritabanındaki Photo İd Al
        const photoId=photo.image_id;
        //Cloudinaryden Silme
        await cloudinary.uploader.destroy(photoId)
        //Photo Yükleme
        const result=await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename:true,
                folder:"lenslight_Tr",
            }
        );
        //Photo İd Ve Url Güncelleme
        photo.url=result.secure_url;
        photo.image_id=result.public_id;

        //Photolaro Silme(Temp)
       fs.unlinkSync(req.files.image.tempFilePath); 
        }
        //Görsel Yükleme Yoksa
        photo.name=req.body.name;
        photo.description=req.body.description;

        //Photo Kaydetme
        photo.save();

        //Update Sonra Bu Sayfaya Git 
        //Url Kalıo
        res.status(200).redirect(`/photos/${req.params.id}`);
      
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error,
          });
          
    }
}

//Başka Dosyalarda Kullanmak İçin Export
export {createPhoto,getAllPhotos,getAPhoto,deletePhoto,updatePhoto};