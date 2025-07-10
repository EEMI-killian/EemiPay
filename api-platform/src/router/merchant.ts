import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import * as express from "express";
import { CreateMerchantUseCase } from "../usecase/Merchant/CreateMerchant/createMerchant.usecase";
import { GetMerchantUseCase } from "../usecase/Merchant/GetMerchant/getMerchant.usecase";
import { UpdateMerchantUseCase } from "../usecase/Merchant/UpdateMerchant/updateMercant.usecase";
import { GetAllMerchantUseCase } from "../usecase/Merchant/GetAllMerchant/getAllMerchant.usecase";

const router = express.Router();

router.post("/", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const userRepository = new MerchantRepository(
    AppDataSource.getRepository("User"),
  );

  const createMerchantUseCase = new CreateMerchantUseCase(
    merchantRepository,
    userRepository,
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
      notFound: async () => {
        res.status(404).json({ error: "User not found" });
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

router.get("/", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const getAllMerchantUseCase = new GetAllMerchantUseCase(merchantRepository, {
    success: async (merchants) => {
      res.status(200).json(merchants);
    },
    functionalError: async (error: string) => {
      res.status(500).json({ error });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
  });
  try {
    const result = await getAllMerchantUseCase.execute();
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );

  const getMerchantUseCase = new GetMerchantUseCase(merchantRepository, {
    success: async (merchant) => {
      res.status(200).json(merchant);
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
    functionalError: async (error: string) => {
      res.status(500).json({ error });
    },
  });

  try {
    const result = await getMerchantUseCase.execute(
      parseInt(req.params.id, 10),
    );
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );

  const updateMerchantUseCase = new UpdateMerchantUseCase(merchantRepository, {
    success: async () => {
      res.status(200).json({ success: true });
    },
    functionalError: async (error: string) => {
      res.status(500).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    invalidArgs: async (error: string) => {
      res.status(400).json({ error });
    },
  });

  try {
    const result = await updateMerchantUseCase.execute({
      id: parseInt(req.params.id, 10),
      ...req.body,
    });
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );

  try {
    const merchant = await merchantRepository.findById(
      parseInt(req.params.id, 10),
    );
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }
    await merchantRepository.delete(merchant.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
