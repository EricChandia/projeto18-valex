import { Router } from "express";
import { createCard, activateCard, cardTransactions } from "../controllers/cardController";
import { validateSchema } from "../middlewares/schemaValidator";
import { createCardSchema, activateCardSchema } from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post("/createCard", validateSchema(createCardSchema), createCard);
cardRouter.post("/activateCard", validateSchema(activateCardSchema), activateCard);
cardRouter.get("/cardTransactions/:id", cardTransactions);

export default cardRouter;
