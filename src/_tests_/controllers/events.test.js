import { jest } from '@jest/globals';
import { json } from 'express';
const mockQuery = jest.fn();

jest.unstable_mockModule('../../config/db.config.js', () => ({
  default: {
    query: mockQuery,
  },
}))

const {getEvents} = await import('../../controllers/events.js') 

describe('Events Controller - getAllEvents', ()=> {
    it('Should return all events with a status 200', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        mockQuery.mockResolvedValue({rows: [{id: 1, title: 'Nyeri'}]});

        await getEvents(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    })
});

