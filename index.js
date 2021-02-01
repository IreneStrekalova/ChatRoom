require('dotenv').config();
const port = process.env.PORT;
const app = require('express')();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('./src/db/dbConnect');
const authRoute = require('./src/routes/auth');
const chatRoute = require('./src/routes/chat');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Server started');
});

app.use('/auth', authRoute);
app.use('/chat', chatRoute);

app.use((err, req, res, next) => {
    if(!err.status) err.status = 500;
    if(!err.message) err.message = "Something is wrong";
    res.status(err.status).send(err.message);
    console.log('ERROR: ', err);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});