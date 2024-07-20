const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const storage = require("./config");

const gc = require('./config/');
const bucket = gc.bucket('polysnap_media_storage');

const checkResourceExists = (fileId) => new Promise((resolve, reject) => {
    console.log(fileId)
    const blob = bucket.file(fileId)
    blob.exists().then(data => {
        resolve(data[0])
    }).catch(err => {
        console.error(err)
        reject(err)
    })
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

app.get('/downloadImage', async (req, res, next) => {
    try {
        let fileName = req.query.mediaID;
        console.log("file name : " + fileName);
        if (!fileName) {
            res.status(500).send('Media ID not provided!');
        }

        // Télécharge le fichier
        const [fileContents] = await storage.bucket('polysnap_media_storage').file(fileName).download();

        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(fileContents);

    } catch (error) {
        console.error(error);
        next(error);
    }

})

app.get('/', (req, res) => {
    res.send('Api working')
})

app.get('/checkMedia', async (req, res, next) => {
    try {
        const resourceID = req.query.mediaID;

        const resourceExists = await checkResourceExists(resourceID);

        if (resourceExists) {
            res.status(200).json({
                exists: true,
                message: 'This resource exists.',
            });
        } else {
            res.status(404).json({
                exists: false,
                message: 'This resource does not exist.',
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
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
    console.log(`Download media server is now listening on port ${port}`)
})