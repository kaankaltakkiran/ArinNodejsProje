//Sayfa Yönlerdirme İçin Route

import express from "express";
//Sayfa Yönlendirmek İçin Sayfaların Olduğu Yeri İmport Ettim
// Yıldız As Demek Hepsini Alıyor
import * as photoController from "../controllers/photoController.js";
//Router Tanımı
const router=express.Router();
//Post İle Photo Yollama 
//photos Seklinde Oluyor / Boşsa
//Örneğin /test se Şöyle Olur: /photos/test
router.route("/").post(photoController.createPhoto);
//getAllPhotos Çağırma
router.route("/").get(photoController.getAllPhotos);
//Tek Tek Photo İşleri
router.route("/:id").get(photoController.getAPhoto);
//Photo Silme
router.route("/:id").delete(photoController.deletePhoto);
//Photo Update
router.route("/:id").put(photoController.updatePhoto);

//Routerı Export Ettim
export default router;