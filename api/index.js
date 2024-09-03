const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://miguelruizlicea:s63FBpFk6mqbBqCD@cluster0.uicfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ username, password });
        res.json(userDoc);
    }
    catch (e) {
        res.status(400).json(e);
    }
});
// mongodb+srv://miguelruizlicea:s63FBpFk6mqbBqCD@cluster0.uicfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//We are @ 1 hour 2 minutes
// Restart Yarn and Nodemon
app.listen(4000);