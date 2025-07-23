import { IDocumentRepository } from "../../repository/Document/Document.repository.interface";

export class PoolDocumentRepository {
  constructor(private documentRepository: IDocumentRepository) {}
  async execute(id: string): Promise<any> {
    return await this.documentRepository.execute(id);
  }
}
