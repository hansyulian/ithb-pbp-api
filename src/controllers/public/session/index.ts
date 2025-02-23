import { createRouter } from "~/lib/createRouter";
import { authorizationMiddleware } from "~/middlewares/authorizationMiddleware";
import { emailLoginController } from "./emailLoginController";
import { forgetPasswordController } from "./forgetPasswordController";
import { logoutController } from "./logoutController";
import { meController } from "./meController";
import { resetPasswordController } from "./resetPasswordController";
import { updatePasswordController } from "./updatePasswordController";
import { updateProfileController } from "./updateProfileController";

export const sessionController = createRouter();
sessionController.post("/login", emailLoginController);
sessionController.get("/me", authorizationMiddleware(), meController);
sessionController.post("/forget-password", forgetPasswordController);
sessionController.post("/reset-password", resetPasswordController);
sessionController.post(
  "/update-password",
  authorizationMiddleware(),
  updatePasswordController
);
sessionController.post(
  "/update-profile",
  authorizationMiddleware(),
  updateProfileController
);
sessionController.post("/logout", authorizationMiddleware(), logoutController);
