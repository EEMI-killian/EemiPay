export interface IDocumentRepository {
  findById(id: string): Promise<any>;
}
