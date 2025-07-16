import * as express from "express";
import { CreateUserUseCase } from "../usecase/User/CreateUser/createUser.usecase";
import { UserRepository } from "../repository/User/user.repository";
import { AppDataSource } from "../data-source";
import { DeleteUserUseCase } from "../usecase/User/DeleteUser/deleteUser.usecase";
import { UpdateUserPasswordUseCase } from "../usecase/User/updateUserPassword/updateUserPassword.usecase";
import { FindUserByIdUseCase } from "../usecase/User/findUserbyId/findUserById.usecase";
import { HashGateway } from "../gateway/hash/hash.gateway";
import { UuidGateway } from "../gateway/uuid/uuid.gateway";

const router = express.Router();

router.post("/", async (req, res) => {
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const hashGateway = new HashGateway();
  const uuidGateway = new UuidGateway();
  const uc = new CreateUserUseCase(
    userRepository,
    {
      success: async (id: string) => {
        res.status(201).json({ id });
      },
      functionalError: async (error: string) => {
        res.status(400).json({ error });
      },
      alreadyExists: async () => {
        res.status(409).json({ error: "User already exists" });
      },
      invalidArguments: async (error: string) => {
        res.status(400).json({ error });
      },
    },
    hashGateway,
    uuidGateway,
  );

  try {
    const result = await uc.execute(req.body);
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const uc = new DeleteUserUseCase(userRepository, {
    success: async () => {
      res.status(204).send();
    },
    functionalError: async (error: string) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "User not found" });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
  });

  try {
    return await uc.execute({ id: userId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const uc = new FindUserByIdUseCase(userRepository, {
    success: async (user) => {
      res.status(200).json(user);
    },
    functionalError: async (error: string) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "User not found" });
    },
    invalidArguments: async (error: string) => {
      res.status(400).json({ error });
    },
  });

  try {
    return await uc.execute({ id: userId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/reset-password/:id", async (req, res) => {
  const userId = req.params.id;
  const args = req.body;
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const hashGateway = new HashGateway();
  const uc = new UpdateUserPasswordUseCase(
    userRepository,
    {
      success: async () => {
        res.status(204).send();
      },
      functionalError: async (error: string) => {
        res.status(400).json({ error });
      },
      notFound: async () => {
        res.status(404).json({ error: "User not found" });
      },
      invalidPassword: async () => {
        res.status(400).json({ error: "Invalid password" });
      },
      invalidArguments: async (error: string) => {
        res.status(400).json({ error });
      },
    },
    hashGateway,
  );

  try {
    return await uc.execute({
      id: userId,
      ...args,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
