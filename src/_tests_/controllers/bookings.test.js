import { jest } from "@jest/globals";

const mockQuery = jest.fn();

jest.unstable_mockModule("../../config/db.config.js", () => ({
  default: {
    query: mockQuery,
  },
}));

const { getEventAndBooking } = await import("../../controllers/bookings.js");
describe("Events Controller - getEventAndBooking", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { event_id: "10" },
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("Should return 200 and booking details on success", async () => {
    // First query check (checkIfUserHasBooked)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    // Second query check (checkQueryForEvents join)
    const mockDetail = { booking_id: 1, event_title: "Tech Summit" };
    mockQuery.mockResolvedValueOnce({ rows: [mockDetail] });

    await getEventAndBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockDetail,
      }),
    );
    // Check that two queries were made
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("Should return 404 if the user has NOT booked the event", async () => {
    // Mock first query returning empty array
    mockQuery.mockResolvedValueOnce({
      rows: [],
    });

    await getEventAndBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You have not booked this event yet.",
      }),
    );
    // Second query should never run
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("Should return 401 if user is not authenticated", async () => {
    req.user = null;

    await getEventAndBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
