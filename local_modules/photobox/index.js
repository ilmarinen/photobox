var photobox = require('./photobox-model'),
    fs = require('fs'),
    mongoose = require('mongoose')
    im = require('node-imagemagick')
    path = require('path'),
    User = require('../simple-auth/user-model');


exports.uploadPicture = function(req, res){
    res.render('upload', {title: 'Upload Picture', header: 'Welcome to Photobox'});
}


exports.processUploadPicture = function(req, res){
    console.log('Uploaded Image: ', req.files);
    if (req.files.photoImage.size == 0){
        res.redirect('/picture/new');
    }
    else{
    User.findOne({username: req.session.username}, function(err, user){
        var ObjectId = mongoose.Types.ObjectId;
        user_id = ObjectId.fromString(user.id);
        console.log(req.files.photoImage.path);
        data = fs.readFileSync(req.files.photoImage.path);
        thumbnailName = 'thumbnail-' + path.basename(req.files.photoImage.path);
        thumbnailPath = path.join(path.dirname(req.files.photoImage.path), thumbnailName);
        im.resize({srcPath: req.files.photoImage.path, dstPath: thumbnailPath, width: 256}, function(err, stdout, stderr){
            if(err) res.redirect('/picture/new');
            console.log('Successfully resized ' + req.files.photoImage.path + ' to ' + thumbnailPath);
            thumbnailData = fs.readFileSync(thumbnailPath);
            newPhoto = new photobox.Photo();
            newPhoto.owner = user_id;
            newPhoto.title = req.param('imageTitle', 'Untitled Image')
            newPhoto.image.data = data;
            newPhoto.image.contentType = 'image/jpeg';
            newPhoto.thumbnail.data = thumbnailData;
            newPhoto.thumbnail.contentType = 'image/jpeg';
            newPhoto.save(function(err, a){
                if(err) throw err;
                console.log('Saving');
                console.log(a.id);
            });

        });
    });
    console.log('Redirecting');
    res.redirect('/home');
    }
}


exports.welcome = function(req, res){
   res.render('welcome', {title: 'Welcome to Photobox', header: 'Welcome to Photobox'});
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

exports.getThumbnail = function(req, res){
    console.log('get thumbnail');
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": object_id}, function(err, photo){
        console.log(photo.title)
        res.contentType(photo.thumbnail.contentType);
        res.send(photo.thumbnail.data);
    });
}


exports.getGallery = function(req, res){
    res.render('gallery', {title: 'Gallery View', id: req.params.id});
}


exports.viewPicture = function(req, res){
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": object_id}, function(err, pic){
        res.render('picture', {"title": pic.title, header: 'Welcome to Photobox', "picture_id": object_id});
    });
}


exports.newGallery = function(req, res){
    res.render('newgallery', {title: 'New Gallery', header: 'Welcome to Photobox'});
}



exports.getPictures = function(req, res){
    User.findOne({username: req.session.username}, function(err, user){
        var ObjectId = mongoose.Types.ObjectId;
        user_id = ObjectId.fromString(user.id)
        photobox.Photo.find({owner: user_id},function(err, photos){
            if(err) {console.log(err); throw err;}
            var photo_ids = [];
            for(i = 0; i < photos.length; i++){
                console.log('Photo id: ' + photos[i].id);
                photo_ids[i] = photos[i].id
            }
            res.render('gallery', {title: 'Browse Photos', header: 'Welcome to Photobox', 'photo_ids': photo_ids});
        });
    });
}
