var photobox_handler = require('./index');
var simple_auth = require('../simple-auth/');

app.get('/photo/new', simple_auth.authenticate, photobox_handler.uploadPicture);
app.post('/photo/new', simple_auth.authenticate, photobox_handler.processUploadPicture);
app.get('/photo/:id', photobox_handler.getPicture);
app.get('/photo', photobox_handler.getPictures);
app.get('/editphoto/:id', simple_auth.authenticate, photobox_handler.editPicture);
app.post('/editphoto/:id', simple_auth.authenticate, photobox_handler.updatePicture);
app.get('/viewphoto/:id', photobox_handler.viewPicture);
app.get('/thumbnail/:id', photobox_handler.getThumbnail);

app.get('/photos:attribute/:id', photobox_handler.getPhotos);

app.get('/gallery/new', simple_auth.authenticate, photobox_handler.newGallery);

app.get('/home', simple_auth.authenticate, photobox_handler.welcome);
