const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res) => {
    /*
    Gets all items in fakeDb array.
    */
    
    return res.json({ items });
});

router.post("/", (req, res, next) => {
    /*
    Creates new item and appends to list. 
    Checks to make sure that request is not empty or missing 
    either name or price.
    */

    try {
        if (Object.keys(req.body).length === 0) throw new ExpressError("Input is required", 400)
        if (!("name" in req.body)) throw new ExpressError("Name is required", 400)
        if (!("price" in req.body)) throw new ExpressError("Price is required", 400)

        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);

        return res.status(201).json({ "added": { name: newItem.name, price: newItem.price }});
    } catch (e) {
        next(e)
    }
});

router.get("/:name", (req, res, next) => {
    /*
    Gets item passed through params.
    If not found, 404 error.
    */

    try {
        const foundItem = items.find(item => item.name === req.params.name)

        if (foundItem === undefined) {
            throw new ExpressError("Item not found.", 404)
        }
    
        return res.json({ "item": foundItem })  
    } catch(e) {
        next(e)
    }
});

router.patch("/:name", (req, res, next) => {
    /*
    Updates name and or price in item. 
    If item not found, 404 error.
    */

    try {
        const updatedItem = items.find(item => item.name === req.params.name)

        if (updatedItem === undefined) {
            throw new ExpressError("Item not found.", 404)
        }
    
        updatedItem.name = req.body.name
        updatedItem.price = req.body.price
    
        return res.json({ "updated": { updatedItem }}) 
    } catch (e) {
        next(e)
    }
})

router.delete("/:name", (req, res, next) => {
    /*
    Deletes item. 
    If item not found, 404 error.
    */

    try {
        const foundItem = items.findIndex(item => item.name === req.params.name)

        if (foundItem === -1) {
            throw new ExpressError("Item not found.", 404)
        }

        items.splice(foundItem, 1)

        return res.json({ "message": "Deleted" })
    } catch (e) {
        next(e)
    }
})


module.exports = router;