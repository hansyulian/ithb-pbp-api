import { Request, Response } from "express";
import { middleware } from "~/lib/middleware";

describe("middleware", () => {
  it("should call the callback and next function when the callback resolves", async () => {
    const mockCallback = jest.fn().mockResolvedValue(undefined); // Simulate resolved promise
    const mockNext = jest.fn();

    const mockRequest = {} as Request; // Mock request object
    const mockResponse = {} as Response; // Mock response object

    const wrappedMiddleware = middleware(mockCallback);

    // Invoke middleware
    await wrappedMiddleware(mockRequest, mockResponse, mockNext);

    expect(mockCallback).toHaveBeenCalledWith(mockRequest, mockResponse);
    expect(mockNext).toHaveBeenCalledTimes(1); // Ensures next() is called
    expect(mockNext).toHaveBeenCalledWith(); // next() should be called with no arguments
  });

  it("should call next with an error when the callback rejects", async () => {
    const mockError = new Error("Test error");
    const mockCallback = jest.fn().mockRejectedValue(mockError); // Simulate rejected promise
    const mockNext = jest.fn();

    const mockRequest = {} as Request;
    const mockResponse = {} as Response;

    const wrappedMiddleware = middleware(mockCallback);

    // Invoke middleware
    await wrappedMiddleware(mockRequest, mockResponse, mockNext);

    expect(mockCallback).toHaveBeenCalledWith(mockRequest, mockResponse);
    expect(mockNext).toHaveBeenCalledTimes(1); // Ensures next() is called
    expect(mockNext).toHaveBeenCalledWith(mockError); // next() should be called with the error
  });

  it("should pass the correct arguments to the callback", async () => {
    const mockCallback = jest.fn().mockResolvedValue(undefined);
    const mockRequest = { param: "value" } as any as Request; // Mock request with some data
    const mockResponse = {} as Response;

    const wrappedMiddleware = middleware(mockCallback);

    await wrappedMiddleware(mockRequest, mockResponse, jest.fn());

    expect(mockCallback).toHaveBeenCalledWith(mockRequest, mockResponse);
  });
});
