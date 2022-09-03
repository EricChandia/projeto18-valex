import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController";
import { validateSchema } from "../middlewares/schemaValidator";
import { rechargeCardSchema } from "../schemas/rechargeSchema";

const rechargeRouter = Router();


rechargeRouter.post("/rechargeCard", validateSchema(rechargeCardSchema), rechargeCard);


export default rechargeRouter;