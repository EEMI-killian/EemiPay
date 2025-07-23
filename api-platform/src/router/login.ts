import * as express from "express";
import { LoginUsecase } from "../usecase/Login/login.usecase";
import { HashGateway } from "../gateway/hash/hash.gateway";
import { UserRepository } from "../repository/User/user.repository";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { JwtGateway } from "../gateway/jwt/jwt.gateway";
import { Merchant } from "../entity/Merchant";
import { MerchantRepository } from "../repository/Merchant/merchant.repository";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userRepository = new UserRepository(AppDataSource.getRepository(User));
  const merchantRepository = new MerchantRepository(
    AppDataSource.getRepository(Merchant),
  );
  const hashGateway = new HashGateway();
  const jwtGateway = new JwtGateway(process.env.JWT_SECRET);

  const uc = new LoginUsecase(
    userRepository,
    merchantRepository,
    jwtGateway,
    hashGateway,
    {
      success: (token) => res.status(200).json({ token }),
      passwordError: () => res.status(401).json({ error: "Invalid password" }),
      userNotFound: () => res.status(404).json({ error: "User not found" }),
      userInactive: () => res.status(403).json({ error: "User is inactive" }),
      functionalError: (error) => res.status(500).json({ error }),
    },
  );
  try {
    const result = await uc.execute(email, password);
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
