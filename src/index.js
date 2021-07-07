const express = require('express');

const app = express();
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Ready to roll')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});