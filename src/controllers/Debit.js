import Admin from "../services/debit";
import { validation, validateId } from "../validations/debitValidation";

const {
  sendTransaction, getAllDebitsTransaction, findUser, findAccount,
  findReceiver, getTransactionById, sendReceiverMoney, addAccount,
  deleteTransaction, updateGlobalBalance, findReceiverProfile
} = Admin;

/**
 * @class AdmintransactionController
 * @description create transaction, get all transactions, get a transaction, delete a transaction
 * @exports AdminController
 */
export default class AdminDebitController {
  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async sendMoney(req, res) {
    try {
      const { id } = req.user;
      const { email, amount } = req.body;
      const { error } = validation(req.body);
      if (error) {
        return res.status(400).json({ status: 400, error: error.message });
      }
      const user = await findUser(id);
      if (!user) {
        return res.status(404).json({ status: 400, error: "Sorry Sender Account not found." });
      }
      const { globalBalance } = user;
      if (globalBalance < amount) {
        return res.status(404).json({
          status: 400,
          error: "Sorry there is not enough money in your account."
        });
      }
      const receiver = await findReceiver(email);
      const receiverProfile = await findReceiverProfile(receiver.id);
      if (!receiver) {
        return res.status(404).json({ status: 400, error: "Sorry No User with this email address" });
      }
      const { firstName, lastName } = receiverProfile;
      const newTransaction = {
        userId: id, amount, receiverEmail: email, receiverName: `${firstName}, ${lastName}`
      };
      await updateGlobalBalance(id, amount);
      await sendReceiverMoney(receiver.id, amount);
      const sentTransaction = await sendTransaction(newTransaction);
      return res.status(201).json({ status: 201, message: "Amount has been sent successfully.", data: sentTransaction, });
    } catch (error) {
      return res.status(500).json({ status: 500, error: "Server error." });
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async getDebits(req, res) {
    try {
      const transactions = await getAllDebitsTransaction();
      res.status(200).json({
        status: 200,
        message: "Successfully retrived all Debit Transactions.",
        data: transactions,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: "Server error." });
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async getDebitById(req, res) {
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
     * @param {object} res - The user response object
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

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async addBeneficiaryAccount(req, res) {
    try {
      const { id } = req.user;
      const { accountNo, accountName, bankName } = req.body;
      const accountExist = await findAccount(accountNo);
      if (accountExist) return res.status(400)({ status: 400, error: "Account number already exists" });
      const accountDetails = {
        userId: id, accountNo, accountName, bankName
      };
      const userAccount = await addAccount(accountDetails);
      return res.status(201).json({
        status: 201,
        message: "Successfully added Account. Please note only account with registered name would be credited.",
        data: userAccount
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: "Server error.",
      });
    }
  } /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */

  static async withdrawal(req, res) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(422).json({ status: 422, message: "Invalid amount." });
      }
      const user = await findUser(id);
      const receiverProfile = await findReceiverProfile(id);
      if (!user) return res.status(404).json({ status: 404, error: "User Does not Exist." });
      const { globalBalance } = user;
      if (globalBalance < amount) {
        return res.status(404).json({
          status: 400,
          error: "Sorry there is not enough money in your account."
        });
      }
      const randomChars = Math.random().toString(32).substr(8);
      const prefix = `${user.username}_Withdrawal`;

      const createReference = `${prefix}_${randomChars}_${Date.now()}`.toUpperCase();

      const { firstName, lastName } = receiverProfile;
      await updateGlobalBalance(id, amount);
      const transactionDetails = {
        amount,
        receiverName: `${firstName}, ${lastName}`,
        receiverEmail: user.email,
        userId: id,
        reference: createReference,
        transactionType: "Withdrawal"
      };

      const transaction = await sendTransaction(transactionDetails);

      return res.status(200).json({
        status: 200,
        message: "Withdrawal in progress, you will be credited once the transaction is approved.",
        transaction
      });
    } catch (error) {
      return res.status(404).json({
        status: 404,
        error: "Resource not found.",
      });
    }
  }
}
