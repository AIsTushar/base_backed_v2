import { Router } from "express";
import { ExampleControllers } from "./example.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";;
import validateRequest from "../../middleware/validateRequest"
import { ExampleValidations } from "./example.validation";
const router = Router();

router.route("/")
 	.post(
		auth(),
		parseBodyMiddleware,
		validateRequest(ExampleValidations.createExampleSchema),
		ExampleControllers.createExample
	)
  .get(ExampleControllers.getExamples);

router
	.route("/:id")
	.get(ExampleControllers.getExampleById)
	.put(
		auth(),
		parseBodyMiddleware,
		validateRequest(ExampleValidations.updateExampleSchema),
	    ExampleControllers.updateExample)
	.delete(ExampleControllers.deleteExample);

export const ExampleRoutes = router;