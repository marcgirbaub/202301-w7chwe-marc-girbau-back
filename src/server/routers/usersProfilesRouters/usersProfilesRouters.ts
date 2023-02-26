import { Router } from "express";
import { getUsersProfiles } from "../../controllers/usersProfilesControllers/usersProfilesControllers.js";

const allProfilesRoute = "/allprofiles";

export const usersProfilesRouter = Router();

usersProfilesRouter.get(allProfilesRoute, getUsersProfiles);
