import Admin from "../services/credit";

import Payment from "../middlewares/paystack";
import { validation, validateId } from "../validations/creditValidation";

const {
  addTransaction, getAllIncomingTransaction, userExist, profileExist,
  getTransactionById, deleteTransaction, updateGlobalBalance, updateTransactionStatus
} = Admin;
const { initializePayment, verifyPayment } = Payment;

/**
 * @class AdmintransactionController
 * @description create transaction, get all transactions, get a transaction, delete a transaction
 * @exports AdminController
 */
export default class AdminCreditController {
  static async addMoney(req, res) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(422).json({ status: 422, message: "Invalid amount." });
      }

      const user = await userExist(id);
      const userProfile = await profileExist(id);
      if (!user) return res.status(400).json({ status: 400, message: "user does not exist" });

      const randomChars = Math.random().toString(32).substr(8);

      const createReference = `Web _Purchase_${randomChars}}`.toUpperCase();

      const transactionDetails = {
        amount,
        senderName: `${userProfile.firstName}, ${userProfile.lastName}`,
        userId: id,
        reference: createReference
      };

      const transaction = await addTransaction(transactionDetails);

      const paystack_data = {
        amount: amount * 100,
        email: user.email,
        metadata: {
          senderName: `${userProfile.firstName}, ${userProfile.lastName}`,
          userId: user.id,
          transactionId: transaction.id,
        },
      };
      const paymentDetails = await initializePayment(paystack_data);

      return res.status(200).json({ status: 200, message: "Transaction Created", data: paymentDetails });
    } catch (error) {
      return res.status(500).json({ status: 500, error: "Server error." });
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user res.status(400).json object
   * @returns {object} Success message
   */
  static async verify(req, res) {
    try {
      const { trxref } = req.query;
      if (!trxref) return res.status(400).json(res, 404, "No transaction reference found.");

      const resp = await verifyPayment(trxref);
      const { data } = resp.data;
      const transaction = await getTransactionById(data.metadata.transactionId);
      if (!transaction) {
        return res.status(400).json({
          status: 404,
          message: "Transaction record not found, please contact support"
        });
      }
      if (transaction.status !== "pending" && transaction.status !== "failed") {
        return res.status(400).json({ status: 400, message: "Transaction already settled" });
      }

      await updateGlobalBalance(transaction.userId, transaction.amount);
      await updateTransactionStatus(transaction.id, data.status);
      const Transaction = await getTransactionById(data.metadata.transactionId);
      return res.status(200).json({
        status: 200,
        message: "Transaction verified Successfully.",
        data: Transaction
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: "Server error." });
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user res.status(400).json object
     * @returns {object} Success message
     */
  static async getCredits(req, res) {
    try {
      const transactions = await getAllIncomingTransaction();
      res.status(200).json({
        status: 200,
        message: "Successfully retrived all Credit Transactions.",
        data: transactions,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: "Server error." });
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user res.status(400).json object
     * @returns {object} Success message
     */
  static async getCreditById(req, res) {
    try {
      const { id } = req.params;
      const { error } = validateId({ id });
      if (error) return res.status(400).json({ status: 400, error: error.message });
      const Transaction = await getTransactionById(id);
      if (!Transaction) return res.status(404).json({ status: 404, error: "Transaction not found" });
      return res.status(200).json({
        status: 200,
        message: "Successfully retrived Transaction.",
        data: Transaction,
      });
    } catch (error) {
      return res.status(404).json({
        status: 404,
        error: "Resource not found."
      });
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user res.status(400).json object
     * @returns {object} Success message
     */
  static async deleteTransaction(req, res) {
    const { id } = req.params;
    try {
      const { error } = validateId({ id });
      if (error) return res.status(400).json({ status: 400, error: error.message });
      const transaction = await getTransactionById(id);
      if (!transaction) return res.status(404).json({ status: 404, error: "Transaction not found." });
      await deleteTransaction(id);
      return res.status(200).json({
        status: 200,
        message: "Successfully Deleted transaction.",
      });
    } catch (error) {
      return res.status(404).json({
        status: 404,
        error: "Resource not found.",
      });
    }
  }

  static async paystackWebhook(req, res) {
    try {
      const { data } = req.body.data;
      console.log("this is me", req.body);
      const transaction = await getTransactionById(data.reference);
      console.log(transaction);

      return res.status(200).json({
        status: 200,
        message: "transactions completed!",
      });
    } catch (error) {
      return res.status(500).json({ ststus: 500, error: error.message });
    }
  }
}
