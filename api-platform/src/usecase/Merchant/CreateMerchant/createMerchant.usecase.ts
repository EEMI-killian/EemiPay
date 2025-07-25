import z from "zod";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ICreateMerchantUseCase } from "./createMerchant.usecase.interface";
import { CurrencyEnum } from "../../../entity/Merchant";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { IKbisRepository } from "../../../repository/Kbis/KbisRepository.interface";
import { IUuidGateway } from "../../../gateway/uuid/uuid.gateway.interface";

const schema = z.object({
  userId: z.string(),
  companyName: z.string().min(3),
  redirectionUrlConfirm: z.string().url(),
  redirectionUrlCancel: z.string().url(),
  currency: z.nativeEnum(CurrencyEnum),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  kbisUrl: z.string(),
  iban: z.string().min(15).max(34),
});

type CreateMerchantArgs = z.infer<typeof schema>;

export type ICreateMerchantUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> = {
  success: (id: string) => Promise<SuccessType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  alreadyExists: () => Promise<AlreadyExistsType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
  notFound: () => Promise<NotFoundType>;
};

export class CreateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> implements
    ICreateMerchantUseCase<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType,
      NotFoundType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly userRepository: IUserRepository,
    private readonly kbisRepository: IKbisRepository,
    private readonly uuidGateway: IUuidGateway,
    private readonly presenter: ICreateMerchantUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      AlreadyExistsType,
      InvalidArgumentsType,
      NotFoundType
    >,
  ) {}

  async execute(
    args: CreateMerchantArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | AlreadyExistsType
    | InvalidArgumentsType
    | NotFoundType
  > {
    let validatedData: CreateMerchantArgs;

    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return await this.presenter.invalidArguments(error.message);
    }

    try {
      const existingUser = await this.userRepository.findById(
        validatedData.userId,
      );
      if (!existingUser) {
        return await this.presenter.notFound();
      }

      const existingMerchant = await this.merchantRepository.findByCompanyName(
        validatedData.companyName,
      );
      if (existingMerchant) {
        return await this.presenter.alreadyExists();
      }

      await this.kbisRepository.upload(validatedData.kbisUrl);
      const id = await this.uuidGateway.generate("merchant");
      await this.merchantRepository.create({
        id: id,
        userId: validatedData.userId,
        companyName: validatedData.companyName,
        redirectionUrlConfirm: validatedData.redirectionUrlConfirm,
        redirectionUrlCancel: validatedData.redirectionUrlCancel,
        currency: validatedData.currency,
        kbisUrl: validatedData.kbisUrl,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        contactFirstName: validatedData.contactFirstName,
        contactLastName: validatedData.contactLastName,
        iban: validatedData.iban,
      });

      return await this.presenter.success(id);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
