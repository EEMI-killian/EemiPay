import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import * as express from "express";
import { CreateMerchantUseCase } from "../usecase/Merchant/CreateMerchant/createMerchant.usecase";
import { GetMerchantUseCase } from "../usecase/Merchant/GetMerchant/getMerchant.usecase";
import { UpdateMerchantUseCase } from "../usecase/Merchant/UpdateMerchant/updateMercant.usecase";
import { GetAllMerchantUseCase } from "../usecase/Merchant/GetAllMerchant/getAllMerchant.usecase";
import { UserRepository } from "../repository/User/user.repository";
import { DeleteMerchantUseCase } from "../usecase/Merchant/DeleteMerchant/deleteMerchant.usecase";
import { KbisRepository } from "../repository/Kbis/KbisRepository";
import { UuidGateway } from "../gateway/uuid/uuid.gateway";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";
import { Merchant } from "../entity/Merchant";
import { ActivateMerchantUseCase } from "../usecase/Merchant/Activate/activateMerchant.usecase";

const router = express.Router();

router.post("/", checkAuth, checkRole(["ROLE_USER"]), async (req, res) => {
  const userId = req.user.id; 
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const kbisRepository = new KbisRepository();
  const uuidGateway = new UuidGateway();

  const uc = new CreateMerchantUseCase(
    merchantRepository,
    userRepository,
    kbisRepository,
    uuidGateway,
    {
      success: async () => {
        res.status(201).json({ success: true });
      },
      error: async (error: string) => {
        res.status(422).json({ error });
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
    const result = await uc.execute({
      userId,
      companyName:req.body?.companyName,
      redirectionUrlCancel: req.body?.redirectionUrlCancel,
      redirectionUrlConfirm: req.body?.redirectionUrlConfirm,
      currency: req.body?.currency,
      kbisUrl: req.body?.kbisUrl,
      contactEmail: req.body?.contactEmail,
      contactPhone: req.body?.contactPhone,
      contactFirstName: req.body?.contactFirstName,
      contactLastName: req.body?.contactLastName,
      iban: req.body?.iban,
    });
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const uc = new GetAllMerchantUseCase(merchantRepository, {
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
    const result = await uc.execute();
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/:id",
  checkAuth,
  checkRole(["ROLE_ADMIN", "ROLE_USER"]),
  async (req, res) => {
    const merchantRepository = new MerchantRepository(
      AppDataSource.getRepository("Merchant"),
    );

    const uc = new GetMerchantUseCase(merchantRepository, {
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
      const result = await uc.execute({ id: req.params.id });
      return result;
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.patch("/:id", checkAuth, checkRole(["ROLE_ADMIN"]), async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );

  const uc = new UpdateMerchantUseCase(merchantRepository, {
    success: async () => {
      res.status(200).json({ success: true });
    },
    functionalError: async (error: string) => {
      res.status(500).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
  });

  try {
    const result = await uc.execute({
      id: req.params.id,
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

  const uc = new DeleteMerchantUseCase(merchantRepository, {
    success: async () => {
      res.status(204).send();
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    functionalError: async (error: string) => {
      res.status(500).json({ error });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
  });

  try {
    const result = await uc.execute({
      id: req.params.id,
    });
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/:id/activate",
  checkAuth,
  checkRole(["ROLE_ADMIN"]),
  async (req, res) => {
    const merchantRepository = new MerchantRepository(
      AppDataSource.getRepository(Merchant),
    );
    const uc = new ActivateMerchantUseCase(merchantRepository, {
      success: async () => {
        res.status(200).json({ success: true });
      },
      functionalError: async (error: string) => {
        res.status(500).json({ error });
      },
      notFound: async () => {
        res.status(404).json({ error: "Merchant not found" });
      },
    });

    try {
      const result = await uc.execute({
        id: req.params.id,
      });
      return result;
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
