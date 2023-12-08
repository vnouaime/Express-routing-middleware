process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb")

let cereal = { name: "cereal", price: 3.50 }

beforeEach(function() {
    items.push(cereal)
})

afterEach(function() {
    items.length = 0;
})

describe("/GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items')

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [cereal]})
    })
})

describe("/POST /items", () => {
    test("Creates a new item", async () => {
        const milk = { name: "milk", price: 2.20 }
        const res = await request(app).post("/items").send(milk)

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": { name: milk.name, price: milk.price } })
    })

    test("Responds with 400 if empty data is sent", async () => {
        const milk = { name: "milk", price: 2.20 }
        const res = await request(app).post("/items").send({})

        expect(res.statusCode).toBe(400);
    })

    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({ price: 3.50 })

        expect(res.statusCode).toBe(400);
    })

    test("Responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({ name: "milk" })

        expect(res.statusCode).toBe(400);
    })
})

describe("/GET /items/:name", () => {
    test("Gets specific item from param", async () => {
        const res = await request(app).get(`/items/${cereal.name}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "item": cereal })
    })

    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).get(`/items/invalidname`)

        expect(res.statusCode).toBe(404);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name and/or price", async () => {
        const updatedItem = { name: cereal.name, price: 4.50 }
        const res = await request(app).patch(`/items/${cereal.name}`).send(updatedItem)

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": { updatedItem }})
    })

    test("Responds with 404 for invalid name", async () => {
        const updatedItem = { name: cereal.name, price: 4.50 }
        const res = await request(app).patch(`/items/invalidname`).send(updatedItem)

        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async() => {
        const res = await request(app).delete(`/items/${cereal.name}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "message": "Deleted" })
    })

    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).delete(`/items/invalidname`)

        expect(res.statusCode).toBe(404);
    })
})