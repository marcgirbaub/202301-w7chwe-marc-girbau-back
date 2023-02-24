import { type NextFunction, type Request, type Response } from "express";
import { notFoundError } from "./errorMiddlewares";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
const req = {} as Request;
const next = jest.fn() as NextFunction;

afterEach(() => jest.clearAllMocks());

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method", () => {
      notFoundError(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
