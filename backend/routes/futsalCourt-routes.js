import express from "express";
import {
  addFutsalCourt,
  getAllFutsalCourts,
  getFutsalCourtById,
} from "../controllers/futsalCourt-controller.js";
const futsalCourtRouter = express.Router();
futsalCourtRouter.get("/", getAllFutsalCourts);
futsalCourtRouter.get("/:id", getFutsalCourtById);
futsalCourtRouter.post("/", addFutsalCourt);

export default futsalCourtRouter;
