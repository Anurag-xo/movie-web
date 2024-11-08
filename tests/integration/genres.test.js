const request = require('supertest');
const { Genre }= require('../../models/generes');
const { User } = require('../../models/user')
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(async () => {
        server = require('../../app').server;  // Start the server
        await Genre.deleteMany({});            // Clear the genres collection
        await Genre.insertMany([               // Insert 2 genres for the test
            { name: 'genre1' },
            { name: 'genre2' }
        ]);
    });

    afterEach(async() => { 
        server.close();
        await Genre.deleteMany({}); //use deletemany instead of remove
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            const res = await request(server).get('/api/genres');  // Make the GET request
            expect(res.status).toBe(200);                          // Check the status
            expect(res.body.length).toBe(2);                       // Expect 2 genres
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async() => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        })

        it('should return 404 if no genre with the given id exists', async() => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        })
    });

    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const res = await request(server)
                .post('/api/genres')
                .send( {name: 'genre1' });

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            const token  = new User().generateAuthToken();

            const name = new Array(52).join('a');

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send( { name: name });

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async() => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send( { name: 'genre1' });
            
            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should save the genre if it is valid', async() => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send( { name: 'genre1' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    }); 
});