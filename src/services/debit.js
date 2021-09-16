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
  static async sendTransaction(newTransaction) {
    try {
      return await database.Debits.create(newTransaction);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} email  - The user account number
   * @returns {object} - An instance of the Users model class
   */
  static async findReceiver(email) {
    try {
      return await database.Users.findOne({
        where: {
          email
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} accountNo  - The user account number
   * @returns {object} - An instance of the Users model class
   */
  static async findAccount(accountNo) {
    try {
      return await database.Accounts.findOne({
        where: {
          accountNo
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} id - The receiver profile id
   * @returns {object} - An instance of the Users model class
   */
  static async findReceiverProfile(id) {
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
  static async findUser(id) {
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
  static async getAllDebitsTransaction() {
    try {
      return await database.Debits.findAll({ });
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
      return await database.Debits.findOne({
        where: {
          id
        }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} id - The transaction name
   * @returns {object} An instance of the Transactions model class
   */
  static async deleteTransaction(id) {
    try {
      const Transaction = await database.Debits.findOne({ where: { id } });
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
        globalBalance: -amount
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

  /**
   * @param {string} id - The transaction id
   * @param {string} amount - The transaction amount
   * @returns {object} An instance of the Transactions model class
   */
  static async sendReceiverMoney(id, amount) {
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

  /**
   * @param {string} accountDetails - The user account details
   * @returns {object} - An instance of the User model class
   */
  static async addAccount(accountDetails) {
    try {
      return await database.Accounts.create(accountDetails);
    } catch (error) {
      throw error;
    }
  }
}
