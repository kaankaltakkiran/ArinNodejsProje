//Veritabanı Bağlantısı
import mongoose from "mongoose";

//Veritabanı Bağlanma
const conn = () =>{
    //İlk OLarak Bağlantı Stringi
    //İkincisi Confing Nesne
    mongoose
    .connect(process.env.DB_URI,{
     dbName:'lenslight_tr',
     useNewUrlParser:true,
     useUnifiedTopology:true,
     //Promise Döndürüyüyor
    })
    .then(()=>{
     console.log('Veritabanına Bağlandı');
    })
    .catch((err)=>{
     console.log(`!!!!Veritabanına Bağlanmadı!!!!:,${err}`);
    });
};

//AppJste Kullanmak İçin Export ettim
export default conn;