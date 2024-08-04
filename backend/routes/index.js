// const router = e

const express = require('express');
const app = express();
const userRouter = require('./user')
const router = express.Router();
const accountRouter = require('./accounts');

console.log('here i am');


router.use('/user',userRouter);
router.use('/account',accountRouter);
module.exports = router;