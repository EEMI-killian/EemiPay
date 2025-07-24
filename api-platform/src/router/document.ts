import * as express from "express";
import { DocumentRepository } from "../repository/Document/Document.repository";
import { PoolDocumentUseCase } from "../usecase/Document/poolDocument.usecase";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";


const router = express.Router();


router.get("/", checkAuth, checkRole(["ROLE_USER"]),async (req, res) => {

    const usecase = new PoolDocumentUseCase(new DocumentRepository(), {
        success: async (data) => {
            return res.status(200).json({
                data,
            });
        },
        notFound: async () => {
            return res.status(404).json({
                message: "Document not found",
            });
        },
        functionalError: async (error) => {
            return res.status(500).json({
                message: "Internal server error",
                error,
            });
        },
    });
    try{
        const id = req.user.id as string;
        if (!id) {
            return res.status(400).json({
                message: "Missing document ID",
            });
        }
        const result = await usecase.execute(id);
        return result;
    }
    catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});

export default router;