//Express import ettim
import express from "express";

//Veritabanı İçin
//Dotenv İmport
import dotenv from "dotenv"; 
//Env dosyasında ki Değişkenlere ulaşıyoruz.

//Sayfa Yönledirme Dosyasını İmport Ettim
import pageRoute from "./routes/pageRoute.js";
//Photo Yönledirme Dosyasını İmport Ettim
import photoRoute from "./routes/photoRoute.js";
//Register Yönledirme Dosyasını İmport Ettim
import userRoute from "./routes/userRoute.js";
//Register Yönledirme Dosyasını İmport Ettim
import cookieParser from "cookie-parser";
//Veritabanını Uygulama Başlarken Çalışması İçin İmport Ettim
import conn from "./db.js";
//CheckUser İçin
import {checkUser} from "./middlewares/authMiddleware.js";
//File Upload İçin
import fileUpload from "express-fileupload";
//Photo Upload İçin
import {v2 as cloudinary} from "cloudinary";
//Put İşlemi İçin
import methodOverride from 'method-override';

dotenv.config();

//Photo Cloud Ayarları İçin
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET,
});

//Veritabanı Bağlantısı Çağırma
conn();

const app=express();
//Port Envden Geliyor
const port=process.env.PORT;

//Ejs template Engine 
//Html de javascript Çalıştırmak İçin
app.set('view engine','ejs');

//Static Dosyaları Public Olarak Tanımlama
//Ara yazılım 
app.use(express.static('public'));

//PhotoControllerdaki req.body Daki Json Tipinde Verileri Okumak İçin Ekledim
app.use(express.json());
//Register İçin
//Fromdaki Bodyleri Parse Edebilmek İçin
app.use(express.urlencoded({extended:true}));
//Get İle Yönlendirme
//Req ile istek gönderdim
//Bu İsteğe Cevap Response
//Render İçeriği Gösteriyor

//Cokkoie İçim
app.use(cookieParser());
//File Upload İçin
app.use(fileUpload({useTempFiles:true}));
//Put İşlemi İçin
app.use(methodOverride('_method',{
    methods:['POST','GET'],
})
);

//Routes

//Tüm Get Methotlarında CheckUser Kontrol Et
app.use("*",checkUser);
//Eğer / İsteği Gelirse pageRoute a Git
app.use("/",pageRoute);
//Eğer İstek photos İse PhotoRoute a Git
app.use("/photos",photoRoute);
//Eğer İstek register İse userRoute a Git
app.use("/users",userRoute); 
//Port Çalıştırma
//``
app.listen(port,()=>{
console.log(`Uygulama Şu Portta Çalışıyor: ${port}`);
});
