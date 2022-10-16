//Sayfa Yönlerdirme İçin Route

import express from "express";
//Sayfa Yönlendirmek İçin Sayfaların Olduğu Yeri İmport Ettim
// Yıldız As Demek Hepsini Alıyor
import * as pageController from "../controllers/pageController.js";

//Router Tanımı
const router=express.Router();
// İstek Geldiğinde PageControllerdaki getIndexPagei Çalıştır
//Yetkiyi Önce Kontrol Et Sonra Aç 
router.route("/").get(pageController.getIndexPage);
//About İsteği Gelirse PageControllerdaki getAboutPagei Çağır Ve Yönlendir
router.route("/about").get(pageController.getAboutPage);
//Register İsteği Gelirse PageControllerdaki getRegisterPagei Çağır Ve Yönlendir
router.route("/register").get(pageController.getRegisterPage);
//Login İsteği Gelirse PageControllerdaki getRegisterPagei Çağır Ve Yönlendir
router.route("/login").get(pageController.getLoginPage);
//LogOut İsteği Gelirse PageControllerdaki getLogout Çağır Ve Yönlendir
router.route("/logout").get(pageController.getLogout);
//LContact Sayfası Contact İsteiği Gelirse PageContorllerdeki getContactPage 'e Git
router.route("/contact").get(pageController.getContactPage);
//Mail Gönderme İşlemi
router.route("/contact").post(pageController.sendMail);

//Routerı Export Ettim
export default router;