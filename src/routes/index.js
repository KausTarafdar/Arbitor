import express from "express";

import { handleServiceCall } from "../controllers/service.call.controller.js";
import { handleCreateService } from "../controllers/service.create.controller.js";
import { handleDeleteService } from "../controllers/service.delete.controller.js";
import { handleEnableService } from "../controllers/service.enable.controller.js";
import { handleDisableService } from "../controllers/service.disable.controller.js";

const router = express.Router();

//To access a particular service
router.get("/:serviceId", handleServiceCall);

//To create/delete services
router.post("/create", handleCreateService);
router.delete("/delete/:serviceId", handleDeleteService);

//To enable/disable a service
router.patch("/enable", handleEnableService);
router.patch("/disable", handleDisableService);

export default router;