const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes/routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', routes);

app.listen(5000, () => {
 console.log('Server running on port 5000');
});