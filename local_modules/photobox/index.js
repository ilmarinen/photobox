var photobox = require('./photobox-model'),
    fs = require('fs'),
    mongoose = require('mongoose')
    im = require('node-imagemagick')
    path = require('path'),
    User = require('../simple-auth/user-model');


/*-------------Uploading Photos---------------------
The following two functions handle the display of
the photo uploading form as well as the POST
request that handles the data of the uploaded photo.
---------------------------------------------------*/
exports.uploadPicture = function(req, res){
    res.render('photo_upload', {title: 'Upload Picture', header: 'Welcome to Photobox'});
}


exports.processUploadPicture = function(req, res){
    console.log('Uploaded Image: ', req.files);
    if (req.files.photoImage.size == 0){
        res.redirect('/photo/new');
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
            if(err) res.redirect('/photo/new');
            console.log('Successfully resized ' + req.files.photoImage.path + ' to ' + thumbnailPath);
            thumbnailData = fs.readFileSync(thumbnailPath);
            newPhoto = new photobox.Photo();
            newPhoto.owner = user_id;
            newPhoto.title = req.param('imageTitle');
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


/*--------------Get Photo-----------------
The get following three functions handle
the retreival of photos and thumbnails
respectively.
-----------------------------------------*/
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


exports.getPhotos = function(req, res){
    photo_attribute = req.params.attribute.substring(1);
    console.log(photo_attribute);
    var ObjectId = mongoose.Types.ObjectId;
    photo_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": photo_id}, function(err, photo){
        if(err){
            throw err;
        }
        else if(photo_attribute == 'image'){
            res.contentType(photo.image.contentType);
            res.send(photo.image.data);
        }
        else if(photo_attribute == 'thumbnail'){
            res.contentType(photo.thumbnail.contentType);
            res.send(photo.thumbnail.data);
        }
        else if(photo_attribute == 'title'){
            res.contentType('text');
            res.send(photo.title);
        }
        else if(photo_attribute == 'description'){
            res.contentType('text');
            res.send(photo.description);
        }
        else if(photo_attribute == 'owner'){
            res.contentType('text');
            res.send(photo.owner);
        }
        else{
            res.contentType('text');
            res.send('Error: Photo objects do not have ' + req.params.attribute + ' as an attribute.');
        }
    });
}


/*-------------Display Picture/Pictures------------
The following two functions handle the retreival of
a single picture and its meta-data for display, as
well as the retreival of the thumbnails of all the
pictures belonging to a user.
--------------------------------------------------*/
exports.viewPicture = function(req, res){
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({"_id": object_id}, function(err, photo){
        res.render('photo_display', {"title": photo.title, header: 'Welcome to Photobox', "picture_id": object_id, picture_title: photo.title, picture_description: photo.description});
    });
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
            res.render('gallery_display', {title: 'Browse Photos', header: 'Welcome to Photobox', 'photo_ids': photo_ids});
        });
    });
}


/*-----------Edit Picture-------------------------
The following two functions handle the
display of the form for editing the meta-data of
a particular photo.
------------------------------------------------*/
exports.editPicture = function(req, res){
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({_id: object_id}, function(err, photo){
        if(err){
            res.render('general_message', {title: 'Error, image not found.', header: 'Welcome to Photobox', general_message: 'Error, image not found.'});
        }
        else{
            res.render('photo_edit', {title: 'Edit Picture', header: 'Welcome to Photobox', picture_id: photo.id, picture_title: photo.title, picture_description: photo.description});
        }
    });
}


exports.updatePicture = function(req, res){
    var ObjectId = mongoose.Types.ObjectId;
    object_id = ObjectId.fromString(req.params.id)
    photobox.Photo.findOne({_id: object_id}, function(err, photo){
        if(err){
            res.render('general_message', {title: 'Error, image not found.', header: 'Welcome to Photobox', general_message: 'Error, image not found.'});
        }
        else{
            console.log('Update picture with new title: ', req.param('imageTitle'));
            photo.title = req.param('imageTitle', 'Untitled Image');
            photo.description = req.param('imageDescription', '');
            photo.save();
            res.redirect('/viewphoto/' + req.params.id);
        }
    });
}


exports.welcome = function(req, res){
   res.render('welcome', {title: 'Welcome to Photobox', header: 'Welcome to Photobox'});
}


exports.getGallery = function(req, res){
    res.render('gallery', {title: 'Gallery View', id: req.params.id});
}


exports.newGallery = function(req, res){
    res.render('newgallery', {title: 'New Gallery', header: 'Welcome to Photobox'});
}

