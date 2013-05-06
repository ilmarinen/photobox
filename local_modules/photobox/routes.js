var photobox_handler = require('./index');
var simple_auth = require('../simple-auth/');

app.get('/picture/new', simple_auth.authenticate, photobox_handler.uploadPicture);
app.post('/picture/new', simple_auth.authenticate, photobox_handler.processUploadPicture);

app.get('/picture/:id', photobox_handler.getPicture);
app.get('/viewpicture/:id', photobox_handler.viewPicture);
app.get('/gallery/:id', photobox_handler.getGallery);
