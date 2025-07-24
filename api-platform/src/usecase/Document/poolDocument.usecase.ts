import { IDocumentRepository } from "../../repository/Document/Document.repository.interface";
import { IPoolDocumentUseCase } from "./poolDocument.usecase.interface";

interface IPoolDocumentUseCasePresenter<SuccesType, NotFoundErrorType , FunctionalErrorType> {
  success: (data: any) => Promise<SuccesType>;
  notFound: () => Promise<NotFoundErrorType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
}
export class PoolDocumentUseCase<SuccesType, NotFoundErrorType , FunctionalErrorType>  implements IPoolDocumentUseCase<SuccesType, NotFoundErrorType, FunctionalErrorType> {
  constructor(private documentRepository: IDocumentRepository , private presenter: IPoolDocumentUseCasePresenter<SuccesType, NotFoundErrorType, FunctionalErrorType>) {}
  async execute(id: string): Promise<SuccesType | NotFoundErrorType | FunctionalErrorType>{
    try {
      const document = await this.documentRepository.findById(id);
      if (!document) {
        return this.presenter.notFound();
      }
      return this.presenter.success(document);
    } catch (error) {
      return this.presenter.functionalError(error.message);
    }
  }
}