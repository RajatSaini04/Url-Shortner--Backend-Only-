const express = require("express");
const app = express();

const { connectMongoDB } = require('./connection');
// const { logReqRes } = require('./middlewares');
const urlRouter = require('./routes/url');
const URL = require('./models/url');

// Connection
connectMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => {
        console.log("MongoDB CONNECTED");
    })
    .catch(err => {
        console.log("MOngog Error: ", err);
    })

// Middleware - Plugin
app.use(express.json())
// app.use(logReqRes('log.txt'))

// Routes 
app.use('/url', urlRouter)

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        })
    res.redirect(entry.redirectUrl)
})



app.listen(8000, () => { console.log('Server Started 8000'); })