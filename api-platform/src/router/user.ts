import * as express from "express";
import { CreateUserUseCase } from "../usecase/User/createUser/createUser.usecase";
import { UserRepository } from "../repository/User/user.repository";
import { AppDataSource } from "../data-source";
import { DeleteUserUseCase } from "../usecase/User/deleteUser/deleteUser.usecase";
import { UpdateUserPasswordUseCase } from "../usecase/User/updateUserPassword/updateUserPassword.usecase";
import { FindUserByIdUseCase } from "../usecase/User/findUserbyId/findUserById.usecase";

const router = express.Router();

router.post("/", async (req, res) => {
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const createUserUseCase = new CreateUserUseCase(userRepository, {
    success: async (id: number) => {
      res.status(201).json({ id });
    },
    error: async (error: string) => {
      res.status(400).json({ error });
    },
    alreadyExists: async () => {
      res.status(409).json({ error: "User already exists" });
    },
  });

  try {
    const result = await createUserUseCase.execute(req.body);
    return result;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const deleteUserUseCase = new DeleteUserUseCase(userRepository, {
    success: async () => {
      res.status(204).send();
    },
    error: async (error: string) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "User not found" });
    },
  });

  try {
    return await deleteUserUseCase.execute({ id: userId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const userRepository = new UserRepository(
    AppDataSource.getRepository("User"),
  );
  const findUserByIdUseCase = new FindUserByIdUseCase(userRepository, {
    success: async (user) => {
      res.status(200).json(user);
    },
    error: async (error: string) => {
      res.status(400).json({ error });
    },
    notFound: async () => {
      res.status(404).json({ error: "User not found" });
    },
  });

    try {
        return await findUserByIdUseCase.execute({ id: userId });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch("/resetPassword/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const args = req.body;
    const userRepository = new UserRepository(
      AppDataSource.getRepository("User"),
    );
    const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
      userRepository,
      {
        success: async () => {
          res.status(204).send();
        },
        error: async (error: string) => {
          res.status(400).json({ error });
        },
        notFound: async () => {
          res.status(404).json({ error: "User not found" });
        },
        invalidPassword: async () => {
          res.status(400).json({ error: "Invalid password" });
        },
      },
    );
  
    try {
      return await updateUserPasswordUseCase.execute({
        id: userId,
        ...args,
      });
    }
    catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
