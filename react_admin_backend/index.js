require('dotenv').config();
pool = require('./database/mysqldatabase');

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Public Directory (for Web)
app.use(express.static('public'))

//Rutas de MySQL
var appRouter = require('./components/index');
app.use('/api/mysql', appRouter);


app.get('*',(req, res)=> {
    res.sendFile(path.resolve(__dirname,'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Server run on port: ' + process.env.PORT);
});