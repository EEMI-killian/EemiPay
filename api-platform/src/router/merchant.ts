import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import * as express from "express";
import { CreateMerchantUseCase } from "../usecase/Merchant/CreateMerchant/createMerchant.usecase";


const router = express.Router();

// ! add user_id
router.post("/", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );

  const createMerchantUseCase = new CreateMerchantUseCase(
    merchantRepository,
    {
      success: async () => {
        res.status(201).json({ success: true });
      },
      error: async (error: string) => {
        res.status(400).json({ error });
      },
      alreadyExists: async () => {
        res.status(409).json({ error: "Merchant already exists" });
      },
      invalidArguments: async (error: string) => {
        res.status(400).json({ error });
      },
    },
  );
    try {
        const result = await createMerchantUseCase.execute(req.body);
        return result;
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});

export default router;