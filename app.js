const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(require('./routes/index.routes'));
app.get("/", (req, res) => res.json({message: 'Hello World'}));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));