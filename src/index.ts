import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import "express-async-errors";
import errorHandler from "./middlewares/errorHandlersMiddleware";
import router from "./routes/routes";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(errorHandler);
app.use(router);


const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server rodando na porta: ${PORT}`);
});
