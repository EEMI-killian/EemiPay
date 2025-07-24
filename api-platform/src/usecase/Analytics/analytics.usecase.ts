import { Transaction } from "../../entity/Transaction";
import { AppDataSource } from "../../data-source";
import { Merchant } from "../../entity/Merchant";
import { User } from "../../entity/User";
import { Operation } from "../../entity/Operation";
import { IAnalyticsUseCase } from "./analytics.usecase.interface";




interface IAnalyticsUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType
> {
  success: (data : {
      numberOfTransactions: number;
      amountOfTransactions: number;
      numberOfMerchants: number;
      numberOfUsers: number;
      numberOfOperations: number; 
        }) => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
}

export class AnalyticsUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType
>  implements IAnalyticsUseCase<SuccessType,
   FunctionalErrorType,
  NotFoundType>
{

  constructor(
    private readonly presenter: IAnalyticsUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType
    >
  ) {}
  async execute(): Promise<SuccessType | FunctionalErrorType | NotFoundType> {

    try {
    const numberOfTransactions: number = await AppDataSource.getRepository(Transaction).count();
    const amountOfTransactions: number = await AppDataSource.getRepository(Transaction).sum("amount");
    const numberOfMerchants: number = await AppDataSource.getRepository(Merchant).count();
    const numberOfUsers: number = await AppDataSource.getRepository(User).count();
    const numberOfOperations: number = await AppDataSource.getRepository(Operation).count();
 
        const analyticsData : {
      numberOfTransactions: number;
      amountOfTransactions: number;
      numberOfMerchants: number;
      numberOfUsers: number;
      numberOfOperations: number; 
        }= {
      numberOfTransactions,
      amountOfTransactions,
      numberOfMerchants,
      numberOfUsers,
      numberOfOperations
    };

    return await this.presenter.success(analyticsData);

    } catch (error) {
      return await this.presenter.functionalError("An error occurred while fetching analytics data.");
    }





    
  }
}