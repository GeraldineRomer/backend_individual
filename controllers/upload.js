const multer = require('multer')

console.log("estoy por entrar a storage");
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        console.log("en destination ");
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        console.log("en filename ", file);
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.array('images', 3)
