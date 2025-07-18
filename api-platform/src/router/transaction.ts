import * as express from "express";
import { CreateTransactionUseCase } from "../usecase/Transaction/Create/createTransaction.usecase";
import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import { TransactionRepository } from "../repository/Transaction/transaction.repository";

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

export default router;
