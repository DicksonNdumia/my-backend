import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../../config/db.config.js", () => ({
  default: {
    query: mockQuery,
  },
}));

const { getAllUsers } = await import("../../controllers/user.js");

describe("User Controller - getAllUsers", () => {
  it("should return users data with status 200", async () => {
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockQuery.mockResolvedValue({ rows: [{ id: 1, name: "moderator" }] });

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
