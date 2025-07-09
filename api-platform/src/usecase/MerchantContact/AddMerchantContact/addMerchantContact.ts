import z from "zod";
import { IMerchantContactRepository } from "../../../repository/MerchantContact/merchantContact.repository.interface";
import {
  IAddMerchantContactUseCase,
} from "./addMerchantContact.interface";
import { M } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { MerchantContact } from "../../../entity/MerchantContact";

export type IAddMerchantContactUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> = {
  success: () => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  alreadyExists: () => Promise<AlreadyExistsType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
  notFound: () => Promise<NotFoundType>;
};

const schema = z.object({
  merchantId: z.number(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
});

export type IAddMerchantContactUseCaseArgs = z.infer<typeof schema>;

export class AddMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> implements
    IAddMerchantContactUseCase<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType,
      NotFoundType
    >
{
  constructor(
    private readonly merchantContactRepository: IMerchantContactRepository,
    private readonly presenter: IAddMerchantContactUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: IAddMerchantContactUseCaseArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | AlreadyExistsType
    | InvalidArgumentsType
    | NotFoundType
  > {
    let validatedData: IAddMerchantContactUseCaseArgs;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error);
    }
    try {
      let existingMerchantContact: MerchantContact | null = null;

      existingMerchantContact =
        await this.merchantContactRepository.findByEmail(validatedData.email);

      if (existingMerchantContact) {
        return await this.presenter.alreadyExists();
      }

      existingMerchantContact =
        await this.merchantContactRepository.findByPhoneNumber(
          validatedData.phone,
        );

      if (existingMerchantContact) {
        return await this.presenter.alreadyExists();
      }

      
      await this.merchantContactRepository.add({
          merchantId: validatedData.merchantId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phoneNumber: validatedData.phone,
        });

      return await this.presenter.success();
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
