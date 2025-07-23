import { IHashGateway } from "../../gateway/hash/hash.gateway.interface";
import { IJwtGateway } from "../../gateway/jwt/jwt.gateway.interface";
import { MerchantRepository } from "../../repository/Merchant/merchant.repository";
import { UserRepository } from "../../repository/User/user.repository";
import { ILoginUsecase } from "./login.usecase.interface";

export interface ILoginUsecasePresenter<
  SuccessType,
  PasswordErrorType,
  UserNotFoundErrorType,
  UserInactiveErrorType,
  FunctionalErrorType,
> {
  success: (token: string) => Promise<SuccessType>;
  passwordError: () => Promise<PasswordErrorType>;
  userNotFound: () => Promise<UserNotFoundErrorType>;
  userInactive: () => Promise<UserInactiveErrorType>;
  functionalError: (error: Error) => Promise<FunctionalErrorType>;
}

export class LoginUsecase<
  SuccessType,
  PasswordErrorType,
  UserNotFoundErrorType,
  UserInactiveErrorType,
  FunctionalErrorType,
> implements
    ILoginUsecase<
      SuccessType,
      PasswordErrorType,
      UserNotFoundErrorType,
      UserInactiveErrorType,
      FunctionalErrorType
    >
{
  constructor(
    private userRepository: UserRepository,
    private merchantRepository: MerchantRepository,
    private jwtGateways: IJwtGateway,
    private hashGateway: IHashGateway,
    private presenter: ILoginUsecasePresenter<
      SuccessType,
      PasswordErrorType,
      UserNotFoundErrorType,
      UserInactiveErrorType,
      FunctionalErrorType
    >,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<
    | SuccessType
    | PasswordErrorType
    | UserNotFoundErrorType
    | UserInactiveErrorType
    | FunctionalErrorType
  > {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return await this.presenter.userNotFound();
      }

      const isPasswordValid = await this.hashGateway.compare({
        stringAlreadyHashed: user?.password || "",
        input: password,
      });

      if (!isPasswordValid) {
        return await this.presenter.passwordError();
      }
      // const merchant = await this.merchantRepository.findById(user.id);
      // if (!merchant?.isActive) {
      //   return await this.presenter.userInactive();
      // }
      try {
        const token = await this.jwtGateways.sign(user.roles, user.id);
        return await this.presenter.success(token);
      } catch (error) {
        return await this.presenter.functionalError(error.message);
      }
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
