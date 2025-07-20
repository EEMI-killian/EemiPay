import { faker } from "@faker-js/faker";
import { test, describe, expect } from "@jest/globals";
import { TransactionAggregate } from "./transaction.aggregate";
import { CurrencyEnum } from "../entity/Merchant";
import { OperationStatus } from "../entity/Operation";

describe("TransactionAggregate", () => {
  test("it should create a transaction capture and refund it", () => {
    const mockedData = {
      cardNumber: faker.finance.creditCardNumber(),
      cardHolderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
      merchantIban: `iban-${faker.finance.iban()}`,
    };
    const transaction = new TransactionAggregate(
      `transaction-${faker.string.uuid()}`,
      `merchant-${faker.string.uuid()}`,
      `customer-${faker.string.uuid()}`,
      100,
      CurrencyEnum.USD,
      new Date(),
      [],
    );
    transaction.capture({
      amount: 100,
      currency: CurrencyEnum.USD,
      customerCardInfo: {
        ...mockedData,
      },
      merchantIban: mockedData.merchantIban,
    });
    const updateResult = transaction.updateOperationStatus({
      operationId: transaction.operations[0].id,
      status: OperationStatus.COMPLETED,
    });
    transaction.refund({
      amount: 50,
      currency: CurrencyEnum.USD,
      customerCardInfo: {
        ...mockedData,
      },
      merchantIban: mockedData.merchantIban,
    });

    expect(updateResult).toEqual({
      success: true,
      message: "Operation status updated successfully.",
    });
    expect(transaction.operations.length).toBe(2);
  });
  test("it should create a transaction capture not refund it cause the operation is pending", () => {
    const mockedData = {
      cardNumber: faker.finance.creditCardNumber(),
      cardHolderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
      merchantIban: `iban-${faker.finance.iban()}`,
    };
    const transaction = new TransactionAggregate(
      `transaction-${faker.string.uuid()}`,
      `merchant-${faker.string.uuid()}`,
      `customer-${faker.string.uuid()}`,
      100,
      CurrencyEnum.USD,
      new Date(),
      [],
    );
    transaction.capture({
      amount: 100,
      currency: CurrencyEnum.USD,
      customerCardInfo: {
        ...mockedData,
      },
      merchantIban: mockedData.merchantIban,
    });
    try {
      const result = transaction.refund({
        amount: 50,
        currency: CurrencyEnum.USD,
        customerCardInfo: {
          ...mockedData,
        },
        merchantIban: mockedData.merchantIban,
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("No capture operation found to refund against."),
      );
    }
    expect(transaction.operations.length).toBe(1);
  });
  test("it should create a transaction capture but not refund cause the operation is failed", () => {
    const mockedData = {
      cardNumber: faker.finance.creditCardNumber(),
      cardHolderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
      merchantIban: `iban-${faker.finance.iban()}`,
    };
    const transaction = new TransactionAggregate(
      `transaction-${faker.string.uuid()}`,
      `merchant-${faker.string.uuid()}`,
      `customer-${faker.string.uuid()}`,
      100,
      CurrencyEnum.USD,
      new Date(),
      [],
    );
    transaction.capture({
      amount: 100,
      currency: CurrencyEnum.USD,
      customerCardInfo: {
        ...mockedData,
      },
      merchantIban: mockedData.merchantIban,
    });
    transaction.updateOperationStatus({
      operationId: transaction.operations[0].id,
      status: OperationStatus.FAILED,
    });
    try {
      transaction.refund({
        amount: 50,
        currency: CurrencyEnum.USD,
        customerCardInfo: {
          ...mockedData,
        },
        merchantIban: mockedData.merchantIban,
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("No capture operation found to refund against."),
      );
    }
    expect(transaction.operations.length).toBe(1);
  });
  test("it should create a transaction capture but not refund cause the amount exceeds the initial capture", () => {
    const mockedData = {
      cardNumber: faker.finance.creditCardNumber(),
      cardHolderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
      merchantIban: `iban-${faker.finance.iban()}`,
    };
    const transaction = new TransactionAggregate(
      `transaction-${faker.string.uuid()}`,
      `merchant-${faker.string.uuid()}`,
      `customer-${faker.string.uuid()}`,
      100,
      CurrencyEnum.USD,
      new Date(),
      [],
    );
    transaction.capture({
      amount: 100,
      currency: CurrencyEnum.USD,
      customerCardInfo: {
        ...mockedData,
      },
      merchantIban: mockedData.merchantIban,
    });
    transaction.updateOperationStatus({
      operationId: transaction.operations[0].id,
      status: OperationStatus.COMPLETED,
    });
    try {
      transaction.refund({
        amount: 150,
        currency: CurrencyEnum.USD,
        customerCardInfo: {
          ...mockedData,
        },
        merchantIban: mockedData.merchantIban,
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("Refund amount exceeds captured amount."),
      );
    }
    expect(transaction.operations.length).toBe(1);
  });
  test("it should not refund a transaction without a capture", () => {
    const mockedData = {
      cardNumber: faker.finance.creditCardNumber(),
      cardHolderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
      merchantIban: `iban-${faker.finance.iban()}`,
    };
    const transaction = new TransactionAggregate(
      `transaction-${faker.string.uuid()}`,
      `merchant-${faker.string.uuid()}`,
      `customer-${faker.string.uuid()}`,
      100,
      CurrencyEnum.USD,
      new Date(),
      [],
    );
    try {
      transaction.refund({
        amount: 50,
        currency: CurrencyEnum.USD,
        customerCardInfo: {
          ...mockedData,
        },
        merchantIban: mockedData.merchantIban,
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("No capture operation found to refund against."),
      );
    }
    expect(transaction.operations.length).toBe(0);
  });
});
