import * as express from "express";
import { CreateTransactionUseCase } from "../usecase/Transaction/Create/createTransaction.usecase";
import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import { TransactionRepository } from "../repository/Transaction/transaction.repository";
import { captureTransactionUseCase } from "../usecase/Transaction/Capture/captureTransaction.usecase";
import { OperationRepository } from "../repository/Operation/operation.repository";
import { PaymentMethodRepository } from "../repository/PaymentMethod/paymentMethod.repository";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { merchantId, externalRef, amount, currency } = req.body;
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const transactionRepository = new TransactionRepository(
    AppDataSource.getRepository("Transaction"),
  );

  const useCase = new CreateTransactionUseCase(
    merchantRepository,
    transactionRepository,
    {
      success: async (paymentUrl: string) => {
        res.status(201).json({ paymentUrl });
      },
      functionalError: async (error: string) => {
        res.status(400).json({ error });
      },
      invalidArguments: async (error: string) => {
        res.status(400).json({ error });
      },
      notFound: async (error: string) => {
        res.status(404).json({ error });
      },
    },
  );
  try {
    const result = await useCase.execute({
      merchantId,
      externalRef,
      amount,
      currency,
    });
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/capture/:id", async (req, res) => {
  const { id: transactionId } = req.params;
  const { cardHolderName, cvv, expiryDate, cardNumber } = req.body;
  const transactionRepository = new TransactionRepository(
    AppDataSource.getRepository("Transaction"),
  );
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const operationRepository = new OperationRepository(
    AppDataSource.getRepository("Operation"),
  );
  const paymentMethodRepository = new PaymentMethodRepository(
    AppDataSource.getRepository("PaymentMethod"),
  );
  const useCase = new captureTransactionUseCase(
    transactionRepository,
    {
      success: async (transaction) => {
        return res.status(200).json(transaction);
      },
      notFound: async () => {
        return res.status(404).json({ error: "Transaction not found" });
      },
      merchantNotFound: async () => {
        return res.status(404).json({ error: "Merchant not found" });
      },
      functionnalError: async (error: string) => {
        return res.status(400).json({ error });
      },
    },
    merchantRepository,
    paymentMethodRepository,
    operationRepository,
  );
  try {
    await useCase.execute({
      transactionId,
      cardHolderName,
      cvv,
      expiryDate,
      cardNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
