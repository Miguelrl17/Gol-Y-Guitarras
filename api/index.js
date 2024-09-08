const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/User");
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = '234950vsdiaojkl2jdklfdjsa;adfsf2e121';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const salt = bcrypt.genSaltSync(10);
const Post = require("./models/Post")


app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));



mongoose.connect("mongodb+srv://miguelruizlicea:s63FBpFk6mqbBqCD@cluster0.uicfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    }
    catch (e) {
        console.log(e)
        res.status(400).json(e);
    }
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passValid = bcrypt.compareSync(password, userDoc.password);
    if (passValid) {
        jwt.sign({ username, id: userDoc._id }, privateKey, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
        //Logged in
    } else {
        res.status(400).json("Wrong creds");
    }

});
// mongodb+srv://miguelruizlicea:s63FBpFk6mqbBqCD@cluster0.uicfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//We are @ 1 hour 2 minutes
// Restart Yarn and Nodemon

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, privateKey, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json("ok");
})

app.post('/create', uploadMiddleware.single('file'), async (req, res) => {

    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, privateKey, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });

});

app.get('/create', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.listen(4000);