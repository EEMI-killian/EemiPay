import * as express from "express";
import { CreateTransactionUseCase } from "../usecase/Transaction/Create/createTransaction.usecase";
import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import { TransactionRepository } from "../repository/Transaction/transaction.repository";
import { UserRepository } from "../repository/User/user.repository";
import { CaptureTransactionUseCase } from "../usecase/Transaction/Capture/captureTransaction.usecase";
import { OperationRepository } from "../repository/Operation/Operation.repository";
import { CardInfoRepository } from "../repository/CardInfo/cardInfo.repository";


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
  const { id } = req.params;
  const { currency, customerCardInfo, amount } = req.body;
  const transactionRepository = new TransactionRepository(
    AppDataSource.getRepository("Transaction"),
  );
  const operationRepository = new OperationRepository(
    AppDataSource.getRepository("Operation"),
  );

  const cardInfoRepository = new CardInfoRepository(
    AppDataSource.getRepository("CardInfo"),
  );

  const useCase = new CaptureTransactionUseCase(
    transactionRepository,
    operationRepository,
    cardInfoRepository,
    {
      success: async (paymentUrl: string) => {
        res.status(200).json({ paymentUrl });
      },
      providerError: async (error: string) => {
        res.status(400).json({ error });
      },
      notFound: async () => {
        res.status(404).json({ error: "Transaction not found" });
      },
      functionalError: async (error: string) => {
        res.status(400).json({ error });
      },
    },
  );
  try {
    const result = await useCase.execute({
      id,
      currency,
      customerCardInfo,
      amount,
    });
    return result;
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
