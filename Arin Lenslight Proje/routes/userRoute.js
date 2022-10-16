//Sayfa Yönlerdirme İçin Route
import express from "express";
//Sayfa Yönlendirmek İçin Sayfaların Olduğu Yeri İmport Ettim
// Yıldız As Demek Hepsini Alıyor
import * as userController from "../controllers/userController.js";
//Silindiğinde Göstermemesi Reflesh İçin
import * as autMiddleware from "../middlewares/authMiddleware.js";
//Router Tanımı
const router=express.Router();
//Post İle Kullanıcı(Register) Yollama 
router.route("/register").post(userController.createUser);
//Post İle Kullanıcı(Login) Yollama 
router.route("/login").post(userController.loginUser);
//Token Eşleşirse Dashboard
router.route("/dashboard").get(autMiddleware.authenticateToken, userController.getDashBoardPage);
//Post İle Kullanıcı(users) Yollama /Users Geliyor
//Login Olmuş Mu Kontrolü Yaptık Token ile
router.route("/").get(autMiddleware.authenticateToken,userController.getAllUsers);
//Post İle Kullanıcı(users) Yollama /Users Geliyor
//Login Olmuş Mu Kontrolü Yaptık Token ile
router.route("/:id").get(autMiddleware.authenticateToken,userController.getAUser);
//Follow İçin
//Bul Ve Update İçin Put
router.route("/:id/follow").put(autMiddleware.authenticateToken,userController.follow);
//Follow İçin
//Bul Ve Update İçin Put
router.route("/:id/unFollow").put(autMiddleware.authenticateToken,userController.unFollow);
//Routerı Export Ettim
export default router;