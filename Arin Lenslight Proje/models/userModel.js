//Kullanıcı Modeli

//Kullancığımız Veriler İçin Şema Oluşturuyoruz
//Databasde Hangi Bilgileri Tutacağımız

//Şema İçin Mongoose Kullandım
import mongoose from "mongoose";

//Şifreleme İçin Bcrypt
import bcrypt from "bcrypt";

//Hata Mesaji İçin
import validator from "validator";

//Şema Tanımı
const {Schema}=mongoose;

//Şema Bilgileri
const userSchema= new Schema({
username:{
    type:String,
    //Zorunlu
    //Bu Sorun Çıkardı Bak
    required:[true,"Username Girmek Zorunlu."],
    //Kullanıcı Büyük Yazsa Küçük Alcağız
    lowercase:true,
    //Burda Rakam Veya Harf Mı Diye Kontrol Edip Mesaj Yolluyor
    validate:[validator.isAlphanumeric,"Sadece Rakam Ve Harf Girebilirsiniz."],
},
email:{
    type:String,
    required:[true,"Email Girmek Zorunlu."],
    //Benzersiz
    unique:true,
    //Burda Email Mı Diye Kontrol Edip Mesaj Yolluyor
    validate:[validator.isEmail,"Email Doğru Değil."],
},
password:{
    type:String,
    //Burda Password 4 Basamaklı Mı Diye Kontrol Edip Mesaj Yolluyor
    required:[true,"Password Girmek Zorunlu."],
    minLength:[4,"4 Karakterden Az Giremezsin."],
},
//Takipçi Takip Edilen İçin
//Birden Fazla Olabilceği İçin Arry
followers:[
    {
        type:Schema.Types.ObjectId,
        ref:'User',
    },
],
//Takipçi Takip Edilen İçin
followings:[
    {
        type:Schema.Types.ObjectId,
        ref:'User',
    },
],
},
{
    //CreatedAt Ve UploadedAt Ekliyor
    timestamps:true,
}
);

//Şifreleme Mongoose PreHook ile
//Next İşlem Tamamlandıktan Sonra Geçmesi İçin
//Pre Önce
userSchema.pre("save",function(next){
//Bizim User
const user=this;
//Password hashleme
//Salt İse Karmaşıklık Sağlar
//Sonra Callback
bcrypt.hash(user.password,10,(err,hash)=>{
    //Hashlenmiş Passwordu Userın Passworde Atadım
    user.password=hash;
    next();
});
});

//Model Oluşturma
const User=mongoose.model("User",userSchema);

//Başka Yerde Kullanmak İçin
export default User;