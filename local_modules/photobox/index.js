var photobox = require('./photobox-model'),
    fs = require('fs'),
    mongoose = require('mongoose');


exports.uploadPicture = function(req, res){
    res.render('upload', {title: 'Upload Picture'});
}


exports.processUploadPicture = function(req, res){
    console.log(req.files.photoImage.path);
    data = fs.readFileSync(req.files.photoImage.path);
    newPhoto = new photobox.Photo();
    newPhoto.title = 'test photo'
    newPhoto.image.data = data;
    newPhoto.image.contentType = 'image/jpeg';
    newPhoto.save(function(err, a){
        if(err) throw err;
        console.log('Saving');
        console.log(a.id)
    });
    console.log('Redirecting');
    res.redirect('/login');
}


exports.getPicture = function(req, res){
    console.log('get picture');
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": object_id}, function(err, photo){
        console.log(photo.title)
        res.contentType(photo.image.contentType);
        res.send(photo.image.data);
    });
}


exports.getGallery = function(req, res){
    res.render('gallery', {title: 'Gallery View', id: req.params.id});
}


exports.viewPicture = function(req, res){
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": object_id}, function(err, pic){
        res.render('picture', {"title": pic.title, "picture_id": object_id});
    });
}


