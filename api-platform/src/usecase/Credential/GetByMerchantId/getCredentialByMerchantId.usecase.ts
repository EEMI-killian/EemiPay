import { CredentialRepository } from "../../../repository/Credential/CredentialRepository";
import { IGetCredentialByMerchantIdUseCase } from "./getCredentialByMerchantId.usecase.interface";


interface IGetCredentialByMerchantIdUseCasePresenter<SuccessType, ErrorType , NotFoundType> {
    success: (credentials: any) => Promise<SuccessType>;
    notFound: () => Promise<NotFoundType>;
    functionalError: (error: string) => Promise<ErrorType>;
}

export class GetCredentialByMerchantIdUseCase<SuccessType, ErrorType, NotFoundType>  implements IGetCredentialByMerchantIdUseCase<SuccessType, ErrorType, NotFoundType> {
    constructor(private readonly credentialRepository: CredentialRepository , private readonly presenter: IGetCredentialByMerchantIdUseCasePresenter<SuccessType, ErrorType , NotFoundType>) {}

    async execute(merchantId: string) {
        if (!merchantId) {
            await this.presenter.functionalError("Merchant ID is required");
        }

        const credentials = await this.credentialRepository.findByMerchantId(merchantId);
        if (!credentials || credentials.length === 0) {
            await this.presenter.notFound();
        }

        const formattedCredentials = credentials.map(credential => ({
            appId: credential.id,
            appSecret: "app_secret_****",

        }));

        return await this.presenter.success(formattedCredentials);
    }
}