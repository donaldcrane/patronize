import { Router } from "express";
import AdminDebitController from "../controllers/Debit";
import Authentication from "../middlewares/authenticate";

const router = Router();
const { verifyToken } = Authentication;
const {
  sendMoney, getDebitById, getDebits, deleteTransaction, addBeneficiaryAccount, withdrawal
} = AdminDebitController;

router.get("/debits", verifyToken, getDebits);
router.get("/debit/:id", verifyToken, getDebitById);

router.post("/debit", verifyToken, sendMoney);
router.post("/add-beneficiary", verifyToken, addBeneficiaryAccount);
router.post("/withdrawal", verifyToken, withdrawal);

router.delete("/debit/:id", verifyToken, deleteTransaction);

export default router;
