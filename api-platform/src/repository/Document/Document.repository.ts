import mongoose from "mongoose";
import { ModelDocument } from "../../mongoSchema";

export class DocumentRepository {
  constructor() {}

  async getDocumentById(id: string): Promise<any> {
    try {
      await mongoose.connect(
        "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
      );

      const Document = await ModelDocument.findOne({ userId: id });
      await mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });
      return Document;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("Database connection failed");
    }
  }
}
