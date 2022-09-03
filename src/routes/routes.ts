import { Router } from "express";
import cardRoute from "./cardRoute";
import rechargeRoute from "./rechargeRoute";

const router = Router();
router.use(cardRoute);
router.use(rechargeRoute);

export default router;