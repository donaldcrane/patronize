import { Router } from "express";
import UserController from "../controllers/User";
import Authentication from "../middlewares/authenticate";
import parser from "../middlewares/uploads";

const router = Router();
const { verifyToken } = Authentication;
const {
  registerUser, loginUser, updateUserProfile, getUsers, updateUserProfilePicture, getUserById
} = UserController;

router.post("/users/signin", loginUser);
router.post("/users/signup", registerUser);

router.get("/users", verifyToken, getUsers);
router.get("/user", verifyToken, getUserById);

router.put("/user-profile", verifyToken, updateUserProfile);
router.put("/user-profile/image", verifyToken, parser.single("image"), updateUserProfilePicture);

export default router;
