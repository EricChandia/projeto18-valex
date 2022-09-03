import { Router } from "express";
import { createCard, activateCard, cardTransactions, blockCard, unblockCard } from "../controllers/cardController";
import { validateSchema } from "../middlewares/schemaValidator";
import { createCardSchema, activateCardSchema, blockCardSchema } from "../schemas/cardSchema";


const cardRouter = Router();

cardRouter.post("/createCard", validateSchema(createCardSchema), createCard);
cardRouter.post("/activateCard", validateSchema(activateCardSchema), activateCard);
cardRouter.get("/cardTransactions/:id", cardTransactions);
cardRouter.post("/blockCard", validateSchema(blockCardSchema), blockCard);
cardRouter.post("/unblockCard", validateSchema(blockCardSchema), unblockCard);

export default cardRouter;
