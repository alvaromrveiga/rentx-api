import { Router } from "express";

import { SpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/SpecificationsRepository";
import { CreateSpecificationController } from "@modules/cars/useCases/createSpecification/CreateSpecificationController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const specificationsRoutes = Router();

specificationsRoutes.use(ensureAuthenticated);

specificationsRoutes.post("/", new CreateSpecificationController().handle);

specificationsRoutes.get("/", async (request, response) => {
  return response.status(200).json(await new SpecificationsRepository().list());
});

export { specificationsRoutes };
