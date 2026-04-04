import { jest } from "@jest/globals";

const mockQuery = jest.fn();

// Mock the database pool
jest.unstable_mockModule("../../config/db.config.js", () => ({
  default: {
    query: mockQuery,
  },
}));

// Dynamically import the controller after mocking the DB
const { getMyComments } = await import("../../controllers/comments.js");

describe("Comments Controller - getMyComments", () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Define standard req, res, and next objects
    req = {
      user: { id: 123 }, // Mocked authenticated user
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return comments with status 200 when they exist", async () => {
    const mockComments = [
      { id: 1, comment: "Great event!", event_title: "Tech Summit" },
      { id: 2, comment: "I will be there", event_title: "Music Fest" },
    ];

    // Mock DB returning rows
    mockQuery.mockResolvedValue({ rows: mockComments });

    await getMyComments(req, res, next);

    expect(mockQuery).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Here are your comments",
      data: mockComments,
    });
  });

  it("should return status 404 if the user has no comments", async () => {
    // Mock DB returning an empty array
    mockQuery.mockResolvedValue({ rows: [] });

    await getMyComments(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "You haven't made any comments yet",
    });
  });

  it("should call next(error) if the database query fails", async () => {
    const error = new Error("Database connection failed");
    mockQuery.mockRejectedValue(error);

    await getMyComments(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
