import { Router } from "express";

import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";
import { DevolutionRentalController } from "@modules/rentals/useCases/devolutionRental/DevolutionRentalController";
import { ListRentalsByUserController } from "@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalRoutes = Router();

rentalRoutes.use(ensureAuthenticated);

rentalRoutes.post("/", new CreateRentalController().handle);

rentalRoutes.post("/devolution/:id", new DevolutionRentalController().handle);

rentalRoutes.get("/", new ListRentalsByUserController().handle);
export { rentalRoutes };
