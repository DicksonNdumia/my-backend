import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../../config/db.config.js", () => ({
  default: {
    query: mockQuery,
  },
}));

const { getReviews } = await import("../../controllers/reviews.js");
describe("Review Controller - getReviewsMade", () => {
  it("should return reviews data with status 200", async () => {
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockQuery.mockResolvedValue({ rows: [{ id: 1, review: "I love this" }] });

    await getReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
