const express = require("express");
const app = express();
const itemRoutes = require("./routes/items");
const ExpressError = require("./expressError")

app.use(express.json());
app.use("/items", itemRoutes);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404) 
    next(e)
})

app.use((error, req, res, next) => {
    let status = error.status || 500
    let message = error.msg 

    return res.status(status).json({
        error: {message, status}
    })
})

module.exports = app;