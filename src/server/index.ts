import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(notFoundError);
app.use(generalError);
