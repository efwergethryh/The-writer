const mongoose = require('mongoose')

const pictureSchema = new mongoose.Schema(
    {

        
        

    }
)

const Picture = mongoose.model('pictures', pictureSchema);
module.exports = Picture;