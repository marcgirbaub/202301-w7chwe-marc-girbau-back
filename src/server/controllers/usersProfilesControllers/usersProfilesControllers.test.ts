import { type NextFunction, type Request, type Response } from "express";
import User from "../../../database/models/User";
import { getUsersProfiles } from "./usersProfilesControllers";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
const req = {} as Request;
const next = jest.fn() as NextFunction;

const listOfUsersProfiles = [
  {
    username: "ronaldinho10",
    email: "ronaldingo@gaucho.br",
    location: "brazil",
    age: "47",
    avatar: "ronaldingo.jpg",
    friends: [],
    enemies: [],
    id: "63f93cf122cb245a8e88335f",
  },
  {
    username: "asdafa",
    email: "sadfsadfsdaf",
    location: "megas",
    age: "23",
    avatar: "ronaldinhoavatar.jpeg",
    friends: [],
    id: "63fa2fac8b35056fbdafa0db",
  },
];

beforeEach(() => jest.clearAllMocks());

describe("Given a getUsersProfiles controller", () => {
  describe("When it receives a request with an ownerId `101010`", () => {
    test("Then it should call its status method with 200 and json with the list of users", async () => {
      const expectedCodeStatus = 200;

      req.body = { userId: "101010" };

      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(listOfUsersProfiles),
        }),
      });

      await getUsersProfiles(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedCodeStatus);
      expect(res.json).toHaveBeenCalledWith({
        usersProfiles: listOfUsersProfiles,
      });
    });
  });

  describe("When it receives a request without an ownerId", () => {
    test("Then it should call its next method", async () => {
      req.body = {};

      User.find = jest.fn().mockReturnValue(undefined);

      await getUsersProfiles(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
