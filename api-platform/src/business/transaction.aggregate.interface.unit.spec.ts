import { faker } from "@faker-js/faker";
import { test , describe, expect} from "@jest/globals";
import { TransactionArggregate } from "./transaction.aggregate";


describe("TransactionArggregate", () => {
    test("it should create a transaction capture and refund it", () => {
        const mockedData = {
            cardNumber: faker.finance.creditCardNumber(),
                cardHolderName: faker.person.fullName(),
                expiryDate: faker.date.future().toISOString().slice(0, 7), 
                cvv: faker.finance.creditCardCVV(),
            merchantIban: `iban-${faker.finance.iban()}`
        }
        const transaction = new TransactionArggregate(`merchant-${faker.string.uuid()}`, `customer-${faker.string.uuid()}`, 100, "USD");
        transaction.addOperation({
            type: "CAPTURE",
            amount: 100,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        const updateResult = transaction.updateOperationStatus({
            operationId: transaction.operations[0].id,
            status: "COMPLETED"
        });
        transaction.addOperation({
            type: "REFUND",
            amount: 50,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        
        expect(updateResult).toEqual({ success: true , message: "Operation status updated successfully." });
        expect(transaction.operations.length).toBe(2);
    });
    test("it should create a transaction capture not refund it cause the operation is pending", () => {
        const mockedData = {
            cardNumber: faker.finance.creditCardNumber(),
                cardHolderName: faker.person.fullName(),
                expiryDate: faker.date.future().toISOString().slice(0, 7), 
                cvv: faker.finance.creditCardCVV(),
            merchantIban: `iban-${faker.finance.iban()}`
        }
        const transaction = new TransactionArggregate(`merchant-${faker.string.uuid()}`, `customer-${faker.string.uuid()}`, 100, "USD");
        transaction.addOperation({
            type: "CAPTURE",
            amount: 100,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        const result = transaction.addOperation({
            type: "REFUND",
            amount: 50,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        expect(result).toEqual({ error: "No capture operation found to refund against." });
        expect(transaction.operations.length).toBe(1);
    });
    test("it should create a transaction capture but not refund cause the operation is failed", () => {
        const mockedData = {
            cardNumber: faker.finance.creditCardNumber(),
                cardHolderName: faker.person.fullName(),
                expiryDate: faker.date.future().toISOString().slice(0, 7), 
                cvv: faker.finance.creditCardCVV(),
            merchantIban: `iban-${faker.finance.iban()}`
        }
        const transaction = new TransactionArggregate(`merchant-${faker.string.uuid()}`, `customer-${faker.string.uuid()}`, 100, "USD");
        const captureResult = transaction.addOperation({
            type: "CAPTURE",
            amount: 100,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        transaction.updateOperationStatus({
            operationId: transaction.operations[0].id,
            status: "FAILED"
        });
        const result = transaction.addOperation({
            type: "REFUND",
            amount: 50,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        expect(captureResult).toEqual({ success: true, message: "Capture operation added successfully." });
        expect(result).toEqual({ error: "No capture operation found to refund against." });
        expect(transaction.operations.length).toBe(1);
    });
    test("it should create a transaction capture but not refund cause the amount exceeds the initial capture", () => {
        const mockedData = {
            cardNumber: faker.finance.creditCardNumber(),
                cardHolderName: faker.person.fullName(),
                expiryDate: faker.date.future().toISOString().slice(0, 7), 
                cvv: faker.finance.creditCardCVV(),
            merchantIban: `iban-${faker.finance.iban()}`
        }
        const transaction = new TransactionArggregate(`merchant-${faker.string.uuid()}`, `customer-${faker.string.uuid()}`, 100, "USD");
        transaction.addOperation({
            type: "CAPTURE",
            amount: 100,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        transaction.updateOperationStatus({
            operationId: transaction.operations[0].id,
            status: "COMPLETED"
        });
        const result = transaction.addOperation({
            type: "REFUND",
            amount: 150,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        expect(result).toEqual({ error: "Refund amount exceeds the initial capture amount." });
        expect(transaction.operations.length).toBe(1);
    });
    test("it should not refund a transaction without a capture", () => {
        const mockedData = {
            cardNumber: faker.finance.creditCardNumber(),
                cardHolderName: faker.person.fullName(),
                expiryDate: faker.date.future().toISOString().slice(0, 7), 
                cvv: faker.finance.creditCardCVV(),
            merchantIban: `iban-${faker.finance.iban()}`
        }
        const transaction = new TransactionArggregate(`merchant-${faker.string.uuid()}`, `customer-${faker.string.uuid()}`, 100, "USD");
        const result = transaction.addOperation({
            type: "REFUND",
            amount: 150,
            currency: "USD",
            customerCardInfo: {
                ...mockedData
            },
            merchantIban: mockedData.merchantIban
        });
        expect(result).toEqual({ error: "Cannot refund without a capture operation." });
        expect(transaction.operations.length).toBe(0);
    });
});