import { cardInfo, transactionDto } from "./transaction.aggregate";



export interface ITransactionArggregate {
    addOperation(args : {
        type: "CAPTURE" | "REFUND";
        amount: number;
        currency: string;
        customerCardInfo: cardInfo;
        merchantIban: string;
    }): { success: boolean; message: string } | { error: string };
    updateOperationStatus({ operationId, status }: {
        operationId: string;
        status: "PENDING" | "COMPLETED" | "FAILED";
    }): { success: boolean; message: string } | { error: string };
    toDto():transactionDto;
    }
