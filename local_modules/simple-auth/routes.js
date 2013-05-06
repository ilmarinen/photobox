var simple_auth = require('./index')
app.get('/login', simple_auth.login);
app.get('/register', simple_auth.register);
app.get('/logout', simple_auth.processLogout);
app.post('/login', simple_auth.processLogin);
app.post('/register', simple_auth.processRegister);
