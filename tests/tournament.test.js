// tests/tournament.test.js
describe('Tournament API', () => {
    test('GET /api/tournaments returns 200', async () => {
        const res = await request(app).get('/api/tournaments');
        expect(res.statusCode).toEqual(200);
    });
});