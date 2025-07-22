import * as express from "express";
import { CredentialGateway } from "../gateway/credential/credential.gateway";
import { GenerateCredentialUsecase } from "../usecase/Credential/Generate/generateCredential.usecase";
import { AppDataSource } from "../data-source";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";
import { CredentialRepository } from "../repository/Credential/CredentialRepository";
import { HashGateway } from "../gateway/hash/hash.gateway";
import { RotateCredentialUsecase } from "../usecase/Credential/Rotate/rotateCredential.usecase";
import { DeleteCredentialUseCase } from "../usecase/Credential/Delete/deleteCredential.usecase";
import { checkRole } from "../middlewares/checkRole";
import { checkAuth } from "../middlewares/checkAuth";

const router = express.Router();

router.post("/", checkAuth, checkRole(["ROLE_USER"]), async (req, res) => {
  const credentialGateway = new CredentialGateway();
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const hashGateway = new HashGateway();
  const credentialRepository = new CredentialRepository(
    AppDataSource.getRepository("Credential"),
  );
  const presenter = {
    success: async (credential) => {
      res.status(201).json(credential);
    },
    functionalError: async (error) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    invalidArguments: async (error) => {
      res.status(400).json({ error });
    },
  };

  const uc = new GenerateCredentialUsecase(
    credentialGateway,
    presenter,
    merchantRepository,
    credentialRepository,
    hashGateway,
  );

  try {
    const result = await uc.execute(req.body);
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rotate", checkAuth, checkRole(["ROLE_USER", "ROLE_ADMIN"]), async (req, res) => {
  const credentialGateway = new CredentialGateway();
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const credentialRepository = new CredentialRepository(
    AppDataSource.getRepository("Credential"),
  );
  const hashGateway = new HashGateway();
  const presenter = {
    success: async (credential) => {
      res.status(200).json(credential);
    },
    functionalError: async (error) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "Merchant not found" });
    },
    invalidArguments: async (error) => {
      res.status(400).json({ error });
    },
  };

  const uc = new RotateCredentialUsecase(
    credentialGateway,
    presenter,
    merchantRepository,
    credentialRepository,
    hashGateway,
  );

  try {
    const result = await uc.execute(req.body);
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/", checkAuth, checkRole(["ROLE_USER", "ROLE_ADMIN"]), async (req, res) => {
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository("Merchant"),
  );
  const credentialRepository = new CredentialRepository(
    AppDataSource.getRepository("Credential"),
  );
  const presenter = {
    success: async () => {
      res.status(204).send();
    },
    functionalError: async (error) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "Credential not found" });
    },
    invalidArguments: async (error) => {
      res.status(400).json({ error });
    },
  };

  const uc = new DeleteCredentialUseCase(
    merchantRepository,
    credentialRepository,
    presenter,
  );

  try {
    await uc.execute({
      appId: req.body.appId,
      merchantId: req.body.merchantId,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
