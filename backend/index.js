const express = require("express");

const app = express();
const cors = require('cors')

const PORT = 3000;
const mainRouter = require('./routes/index');


const allRoute = ((req,res,next)=>{
    console.log('yeah works everytime');
    next();
})
app.use(cors())
app.use(express.json())



app.use('/api/v1',allRoute,mainRouter);

app.listen(PORT, () => console.log(`this is port number ${PORT}`))

