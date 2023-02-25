import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import { loginUser, registerUser } from "./usersControllers";
import { CustomError } from "../../CustomError/CustomError";
import mongoose from "mongoose";
import { type UserRegisterCredentials, type UserCredentials } from "../types";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
const req = { file: { originalname: "asda" } } as Request;
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const mockUser: UserCredentials = {
    username: "ronaldinho",
    password: "ronaldinho10",
  };

  describe("When it receives a request with a username `ronaldinho` and password `ronaldinho10` and the user is not registered in the database", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a username `ronaldinho` and password `ronaldinho10` and the user is registered in the database", () => {
    test("Then it should call its status method with 200 and its json method with a token", async () => {
      const expectedStatusCode = 200;
      req.body = mockUser;
      const expectedBodyResponse = { token: "asdfdsfg" };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("asdfdsfg");

      await loginUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When it receives a request with a username `ronaldinho` and password `ronaldinho10` and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the message `Wrong credentials`", async () => {
      const expectedError = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a registerUser controller", () => {
  describe("When it receives a request with a user to register correctly", () => {
    test("Then it should call its status method with 200 and its json method with the message `The user has been created`", async () => {
      const newUser: UserRegisterCredentials = {
        passwordConfirmation: "asdafasda",
        email: "asdfasdf",
        username: "sadfsdf",
        password: "asdafasda",
        location: "sadfsadf",
        age: "sadfsadf",
        avatar: "asdfasdf",
      };
      const expectedMessage = { message: "The user has been created" };
      const expectedStatusCode = 201;

      req.body = newUser;
      bcrypt.hash = jest.fn().mockResolvedValue("asdfasdg3425342dsafsdfg");
      User.create = jest.fn().mockResolvedValue(newUser);

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with a user to register and the passwords don't match", () => {
    test("Then it should call its next method with and error message `Passwords don't match`", async () => {
      const newUser: UserRegisterCredentials = {
        passwordConfirmation: "asdafasda",
        email: "asdfasdf",
        username: "sadfsdf",
        password: "assdsddafasda",
        location: "sadfsadf",
        age: "sadfsadf",
        avatar: "asdfasdf",
      };
      const expectedError = new CustomError(
        "Passwords don't match",
        400,
        "Passwords don't match"
      );

      req.body = newUser;

      await registerUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a user to register without username", () => {
    test("Then it should call its next method with and error message `The user couldn't be created`", async () => {
      const newUser = {
        passwordConfirmation: "assdsddafasda",
        email: "asdfasdf",
        password: "assdsddafasda",
        location: "sadfsadf",
        age: "sadfsadf",
        avatar: "asdfasdf",
      };
      const expectedError = new CustomError(
        "The user couldn't be created",
        409,
        "There was a problem creating the user"
      );

      req.body = newUser;
      User.create = jest.fn().mockRejectedValue(undefined);

      await registerUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
