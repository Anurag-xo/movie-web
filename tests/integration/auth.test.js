const { before } = require('lodash');
const { User } = require('../../models/user');
const request = require('supertest');
const { server } = require('../../app');


describe('auth middleware', () => {
    beforeEach( () => { 
        
    });

    afterEach(async () => {
        await server.close();
    });

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1 '});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should retuen 401 if no token is provided', async() => {
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);
    });
});