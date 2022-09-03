import { Router } from "express";
import cardRoute from "./cardRoute";
import rechargeRoute from "./rechargeRoute";
import paymentRoute from "./paymentRoute";

const router = Router();
router.use(cardRoute);
router.use(rechargeRoute);
router.use(paymentRoute);

export default router;