const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(process.env.PORT || 4444, () => {
    console.log(`Server is running on port ${process.env.PORT || 4444}`);
})