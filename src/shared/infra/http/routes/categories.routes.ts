import { Router } from "express";
import multer from "multer";

import { CreateCategoryController } from "@modules/cars/useCases/createCategory/CreateCategoryController";
import { ImportCategoryController } from "@modules/cars/useCases/importCategory/ImportCategoryController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const categoriesRoutes = Router();

const upload = multer({
  dest: "./tmp",
});

categoriesRoutes.get("/", new ListCategoriesController().handle);

categoriesRoutes.use(ensureAuthenticated);
categoriesRoutes.use(ensureAdmin);

categoriesRoutes.post("/", new CreateCategoryController().handle);

categoriesRoutes.post(
  "/import",
  upload.single("file"),
  new ImportCategoryController().handle
);

export { categoriesRoutes };
