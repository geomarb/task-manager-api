const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { users, tasks, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should create task for user', async () => {
    const description = 'From my test'
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send({
            description
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.description).toEqual(description)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${users.one.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete('/tasks/' + tasks.one._id)
        .set('Authorization', `Bearer ${users.two.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(tasks.one._id)
    expect(task).not.toBeNull()
})

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks