import { BlueprintValidationException } from "~/exceptions/BlueprintValidationExceptions";
import { FileNotFoundException } from "~/exceptions/NotFoundException";
import { apiBlueprint } from "~/lib/apiBlueprint"; // replace with actual import if needed
import { controller } from "~/lib/controller";
import fs from "fs";
jest.mock("fs");

describe("controller", () => {
  const mockJson = jest.fn();
  const mockSendFile = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({
    json: mockJson,
    sendFile: mockSendFile,
  });
  const mockRequest = {} as any;
  const mockResponse = {
    status: mockStatus,
    json: mockJson,
    sendFile: mockSendFile,
    locals: {},
  } as any;
  const mockNext = jest.fn() as any;

  const sampleBlueprint = apiBlueprint({
    responseType: "object",
    model: { id: Number, name: String },
    params: { id: String },
    query: { search: String },
    body: { data: String },
  });

  const mockControllerFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockControllerFn.mockReset();
  });

  it("should call the controller function with valid context on success", async () => {
    // Arrange
    mockRequest.query = { search: "example" };
    mockRequest.params = { id: "123" };
    mockRequest.body = { data: "sample data" };

    mockControllerFn.mockResolvedValue({ id: 1, name: "Test" });
    const wrappedController = controller(sampleBlueprint, mockControllerFn);

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockControllerFn).toHaveBeenCalledWith({
      body: { data: "sample data" },
      query: { search: "example" },
      params: { id: "123" },
      locals: mockResponse.locals,
      request: mockRequest,
      response: mockResponse,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ id: 1, name: "Test" });
    expect(wrappedController._hyBlueprint).toStrictEqual(sampleBlueprint);
  });
  it("should treat all query as optional ", async () => {
    // Arrange
    mockRequest.query = {};
    mockRequest.params = { id: "123" };
    mockRequest.body = { data: "sample data" };

    mockControllerFn.mockResolvedValue({ id: 1, name: "Test" });
    const wrappedController = controller(sampleBlueprint, mockControllerFn);

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockControllerFn).toHaveBeenCalledWith({
      body: { data: "sample data" },
      query: {},
      params: { id: "123" },
      locals: mockResponse.locals,
      request: mockRequest,
      response: mockResponse,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ id: 1, name: "Test" });
    expect(wrappedController._hyBlueprint).toStrictEqual(sampleBlueprint);
  });

  it("should throw BlueprintValidationException when validation fails", async () => {
    // Arrange
    mockRequest.query = { search: {} }; // Invalid type that we force
    const wrappedController = controller(sampleBlueprint, mockControllerFn);

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(
      expect.any(BlueprintValidationException)
    );
  });

  it("should handle array response type correctly", async () => {
    // Arrange
    const arrayBlueprint = apiBlueprint({
      responseType: "array",
      model: { id: Number, name: String },
      params: {},
      query: {},
      body: {},
    });
    mockControllerFn.mockResolvedValue({ records: [{ id: 1, name: "Test" }] });
    const wrappedController = controller(arrayBlueprint, mockControllerFn);

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      records: [{ id: 1, name: "Test" }],
    });
  });

  it("should handle paginatedArray response type correctly", async () => {
    // Arrange
    const paginatedArrayBlueprint = apiBlueprint({
      responseType: "paginatedArray",
      model: { id: Number, name: String },
      params: {},
      query: {},
      body: {},
    });
    mockControllerFn.mockResolvedValue({
      records: [{ id: 1, name: "Test" }],
      info: { count: 1 },
    });
    const wrappedController = controller(
      paginatedArrayBlueprint,
      mockControllerFn
    );

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      records: [{ id: 1, name: "Test" }],
      info: { count: 1 },
    });
  });
  it("should handle file response type correctly", async () => {
    (fs.existsSync as jest.Mock).mockResolvedValueOnce(true);
    // Arrange
    const paginatedArrayBlueprint = apiBlueprint({
      responseType: "file",
      model: {},
      params: {},
      query: {},
      body: {},
    });
    mockControllerFn.mockResolvedValue("/some-file-path.txt");
    const wrappedController = controller(
      paginatedArrayBlueprint,
      mockControllerFn
    );

    // Act
    await wrappedController(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockSendFile).toHaveBeenCalledWith("/some-file-path.txt");
  });
});
