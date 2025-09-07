"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const clientInfoParser_1 = __importDefault(require("../../middleware/clientInfoParser"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getAllUser);
router.get("/me", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), user_controller_1.UserController.myProfile);
router.post("/", clientInfoParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.registerUser);
router.patch("/:id/status", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.updateUserStatus);
exports.UserRoutes = router;
