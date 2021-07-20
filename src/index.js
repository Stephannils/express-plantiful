const express = require('express');
const userRouter = require('./routes/user');
const plantRouter = require('./routes/plant');
require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(plantRouter);


app.get('/', (req, res) => {
  res.send('Ready to roll');
});

app.listen(port, () => {
  console.log('Server is running on ' + port);
});