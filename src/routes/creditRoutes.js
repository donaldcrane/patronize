import { Router } from "express";
import AdminCreditController from "../controllers/Credit";
import Authentication from "../middlewares/authenticate";

const router = Router();
const { verifyToken } = Authentication;
const {
  addMoney, verify, getCreditById, getCredits, deleteTransaction, paystackWebhook
} = AdminCreditController;

router.get("/credits", verifyToken, getCredits);
router.get("/credit/:id", verifyToken, getCreditById);

router.get("/paystack/verify", verify);

router.post("/paystack/initialize", verifyToken, addMoney);
router.post("/paystack/webhook", paystackWebhook);

router.delete("/credit/:id", verifyToken, deleteTransaction);

export default router;
