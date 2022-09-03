import { Router } from "express";
import { payment } from "../controllers/paymentController";
import { paymentSchema } from "../schemas/paymentSchema";
import { validateSchema } from "../middlewares/schemaValidator";

const paymentRouter = Router();

paymentRouter.post("/payment",  validateSchema(paymentSchema), payment);


export default paymentRouter;