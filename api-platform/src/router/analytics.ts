import * as express from "express";
import { AnalyticsUseCase } from "../usecase/Analytics/analytics.usecase";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";
const router = express.Router();


router.get("/",checkAuth,checkRole(["ROLE_ADMIN"]), async (req, res) => {
    const analyticsUseCase = new AnalyticsUseCase({
        success: async (data) => {
            return res.status(200).json(data);
        },
        functionalError: async (error) => {
            return res.status(400).json({ error });
        },
        notFound: async () => {
            return res.status(404).json({ error: "Not Found" });
        } 
    });

    const result = await analyticsUseCase.execute();
    if (result instanceof Error) {
        return res.status(500).json({ error: result.message });
    }
    return result;
});

export default router;