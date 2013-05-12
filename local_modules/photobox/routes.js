var photobox_handler = require('./index');
var simple_auth = require('../simple-auth/');

app.get('/picture/new', simple_auth.authenticate, photobox_handler.uploadPicture);
app.post('/picture/new', simple_auth.authenticate, photobox_handler.processUploadPicture);
app.get('/picture/:id', photobox_handler.getPicture);
app.get('/picture', photobox_handler.getPictures);
app.get('/editpicture/:id', simple_auth.authenticate, photobox_handler.editPicture);
app.post('/editpicture/:id', simple_auth.authenticate, photobox_handler.updatePicture);
app.get('/viewpicture/:id', photobox_handler.viewPicture);
app.get('/thumbnail/:id', photobox_handler.getThumbnail);


app.get('/gallery/new', simple_auth.authenticate, photobox_handler.newGallery);

app.get('/home', simple_auth.authenticate, photobox_handler.welcome);
