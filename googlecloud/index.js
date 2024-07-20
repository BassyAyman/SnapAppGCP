const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors'); // Importez le middleware CORS
const {v4: uuidv4} = require('uuid');

const storage = require("./config");

const util = require('util')
const gc = require('./config/')
const bucket = gc.bucket('polysnap_media_storage')

const {format} = util

const uploadImage = (file, id) => new Promise((resolve, reject) => {
    console.log("begining of uploadImage function")

    const {originalname, buffer} = file

    //const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blob = bucket.file(id)
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: 'image/jpeg',
    })

    console.log("uploading file with created id: " + id)

    blobStream.on('finish', () => {
        console.log("uploaded file on bucket with id: " + id)
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        )
        resolve(id)
    })
        .on('error', (error) => {
            reject(`Unable to upload image, something went wrong: ${error}`)
            console.error(`Unable to upload image, something went wrong: ${error}`)
            reject("Unable to upload image, something went wrong", error)
        })
        .end(buffer)
})


const app = express();
app.use(cors());

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        // no larger than 5mb.
        fileSize: 5 * 1024 * 1024,
    },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
    try {
        const myFile = req.file
        const id = "smoke_" + uuidv4();
        const imageId = await uploadImage(myFile, id)

        res
            .status(200)
            .json({
                message: "Upload was successful",
                data: imageId
            })
    } catch (error) {
        console.error(error)
        next(error)
    }
})

app.post('/uploadStory', async (req, res, next) => {
    try {
        const myFile = req.file
        const id = "smoke_" + uuidv4();
        const imageId = await uploadImage(myFile, id)

        res
            .status(200)
            .json({
                message: "Upload was successful",
                data: imageId
            })
    } catch (error) {
        console.error(error)
        next(error)
    }
})


app.get('/', (req, res) => {
    res.send('Api working')
})

app.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'Internal server error!',
    })
    next()
})

let port = process.env.PORT || 9001
app.listen(port, () => {
    console.log(`Upload media server is now listening on port ${port}`)
})
