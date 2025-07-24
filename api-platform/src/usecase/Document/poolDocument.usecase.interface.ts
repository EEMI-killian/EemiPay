export interface IPoolDocumentUseCase<SuccesType, NotFoundErrorType , FunctionalErrorType> {
  execute(id: string): Promise<SuccesType | NotFoundErrorType | FunctionalErrorType>;
}