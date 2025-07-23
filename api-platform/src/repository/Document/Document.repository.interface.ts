export interface IDocumentRepository {
  execute(id: string): Promise<any>;
}
