import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} from "sequelize-test-helpers";
import chai, { expect } from "chai";

import sinonChai from "sinon-chai";
import AccountModel from "../../models/account";

chai.use(sinonChai);

describe("src/models/account", () => {
  const Account = AccountModel(sequelize, dataTypes);
  const account = new Account();

  checkModelName(Account)("Accounts");
  context("properties", () => {
    ["userId", "accountNo", "accountName", "bankName"].forEach(
      checkPropertyExists(account),
    );
  });
});
