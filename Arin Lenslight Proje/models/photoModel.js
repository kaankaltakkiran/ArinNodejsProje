//Kullancığımız Veriler İçin Şema Oluşturuyoruz
//Databasde Hangi Bilgileri Tutacağımız

//Şema İçin Mongoose Kullandım
import mongoose from "mongoose";

//Şema Tanımı
const {Schema}=mongoose;

//Şema Bilgileri
const photoSchema= new Schema({
name:{
    type:String,
    //Zorunlu
    required:true,
    //Boşlukları Siler
    trim:true
},
description:{
    type:String,
    required:true,
    trim:true
},
uploadedAt:{
    type:Date,
    default:Date.now,
},
user:{
    //Model Refarasns
    type:Schema.Types.ObjectId,
    ref:"User",
},
//Görselin Url
url:{
type:String,
required:true,
},
//Photo Silmek İçin
image_id:{
 type:String,
}
});

//Model Oluşturma
const Photo=mongoose.model("Photo",photoSchema);

//Başka Yerde Kullanmak İçin
export default Photo;