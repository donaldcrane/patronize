import sequelize from "sequelize";
import database from "../models";

/**
 * @class Admin
 * @description allows admin user create and check Money details
 * @exports Admin
 */
export default class Admin {
  /**
   * @param {string} newTransaction - The Transaction details
   * @returns {object} An instance of the Transactions model class
   */
  static async addTransaction(newTransaction) {
    try {
      return await database.Credits.create(newTransaction);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} id  - The user id
   * @returns {object} - An instance of the Users model class
   */
  static async profileExist(id) {
    try {
      return await database.Profiles.findOne({
        where: {
          userId: id
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} id  - The user id
   * @returns {object} - An instance of the Users model class
   */
  static async userExist(id) {
    try {
      return await database.Users.findOne({
        where: {
          id
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @returns {object} An instance of the Transactions model class
   */
  static async getAllIncomingTransaction() {
    try {
      return await database.Credits.findAll({ });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} id - The transaction id
   * @returns {object} An instance of the Transactions model class
   */
  static async getTransactionById(id) {
    try {
      return await database.Credits.findOne({
        where: {
          id
        }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} id - The user id
   * @param {string} status - The transaction status
   * @returns {object} - An instance of the Profile model class
   */
  static async updateTransactionStatus(id, status) {
    try {
      return await database.Credits.update({ status }, {
        where: { id },
        returning: true,
        plain: true
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} id - The user id
   * @param {string} ref - The transaction reference
   * @returns {object} - An instance of the Profile model class
   */
  static async updateTransactionRef(id, ref) {
    try {
      return await database.Credits.update({ reference: ref }, {
        where: { id },
        returning: true,
        plain: true
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} id - The transaction name
   * @returns {object} An instance of the Transactions model class
   */
  static async deleteTransaction(id) {
    try {
      const Transaction = await database.Credits.findOne({ where: { id } });
      return await Transaction.destroy({ cascade: true });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} id - The transaction id
   * @param {string} amount - The transaction amount
   * @returns {object} An instance of the Transactions model class
   */
  static async updateGlobalBalance(id, amount) {
    try {
      return await database.Users.increment({
        globalBalance: +amount
      }, {
        where: {
          id
        },
        returning: true,
        plain: true
      });
    } catch (err) {
      throw err;
    }
  }
}
