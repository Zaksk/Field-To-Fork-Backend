const express = require('express');
const cors = require('cors');

const userRouter = require('./routers/user')
//const questionsRouter = require('./routes/products')

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "Field To Fork",
        description: "A platform dedicated to supporting local sustainability efforts by reducing food waste and providing affordable, fresh produce to the community."
    })
})

app.use("/users", userRouter);
//app.use("/products", questionsRouter)

module.exports = app;