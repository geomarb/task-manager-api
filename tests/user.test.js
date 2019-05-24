const request = require('supertest')
const app = require('../src/app')
const { users, setupDatabase } = require('./fixtures/db')
const User = require('../src/models/user')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const name = 'Geomar'
    const email = 'gtcbrs@gmail.com'
    const response = await request(app).post('/users').send({
        name,
        email,
        password: users.one.password
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name,
            email
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe(users.one.password)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: users.one.email,
        password: users.one.password
    }).expect(200)

    //Assert that token in response matches users second token
    const user = await User.findById(users.one._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should NOT login NON existing user', async () => {
    await request(app).post('/users/login').send({
        email: users.one.email,
        password: 'wrongpass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile or unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert null response to make sure the user was deleted
    const user = await User.findById(users.one._id)
    expect(user).toBeNull()

})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(users.one._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(200)

    const user = await User.findById(users.one._id)
    expect(user.name).toEqual('New Name')
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send({
            location: 'Quarai'
        })
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated