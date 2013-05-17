var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PhotographerSchema = Schema({
    name: {type: String, trim: true, required: true, index: {unique: true}},
    image: {data: Buffer, contentType: String},
    thumbnail: {data: Buffer, contentType: String},
    bio: {type: String, trim: true}
});

var PhotoSchema = Schema({
    title: {type: String, trim: true},
    image: {data: Buffer, contentType: String},
    thumbnail: {data: Buffer, contentType: String},
    description: {type: String, trim: true},
    photographer: Schema.ObjectId,
    tags: [String],
    owner: Schema.ObjectId,
    deleted: Boolean
});

var GallerySchema = Schema({
    title: {type: String, trim: true, required: true, index: {unique: true}},
    cover: Schema.ObjectId,
    description: {type: String, trim: true},
    photos: [Schema.ObjectId],
    tags: [String],
    owner: Schema.ObjectId
});



module.exports.Photographer = mongoose.model('Photographer', PhotographerSchema);
module.exports.Photo = mongoose.model('Photo', PhotoSchema);
module.exports.Gallery = mongoose.model('Gallery', GallerySchema);
