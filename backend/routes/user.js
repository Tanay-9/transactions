const express = require('express');
const router = express.Router();
const { userValidate, updateValidate, inValidate } = require('../config');
const { User, Account } = require('../db');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// Route to check if the router is working

router.get('/', (req, res) => {
    res.json({
        message: 'API is working'
    });
});


router.post('/signup', async (req, res) => {
    try {
        console.log("dude");
        const validate = userValidate.safeParse(req.body);
      
        if (!validate.success) {
            return res.status(400).json({
                message: validate?.error?.issues[0].message,
                validate
            });
        }
       
        
        const existingUser = await User.findOne({
            username: req.body.username
        });
       
        if (existingUser) {
            return res.status(411).json({
                message: "user already exists"
            });
        }


        const newUser = await User.create(req.body);
        const user_Id = newUser._id;

        await Account.create({
            userId: user_Id,
            balance: 1 + Math.random() * 10000
        })

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);


        res.status(200).json({
            message: 'User created successfully',
            userId: newUser._id,
            token
        });
    } catch (err) {

        console.error("Error in user signup:", err);
        res.status(500).json({
            message: "Internal server error"

        });
    }
});


router.post('/signin', async (req, res) => {
    const validate = inValidate.safeParse(req.body);
    if (!validate.success) {
        return res.json({
            message: validate?.error?.issues[0].message
        })
    }

    const findUser = await User.findOne({
        username: req.body.username
    })
    // console.log(findUser, 'user is');

    if (!findUser) return res.status(401).json({
        message: "please signup first.",
        
    })
    // console.log(findUser);
    if(findUser.password !== req.body.password) return res.status(401).json({message : "invalid password"})
    const token = jwt.sign({ userId: findUser._id }, JWT_SECRET);

    return res.status(200).json({
        message: "sigin done",
        token,
        username : findUser.username,
        firstName : findUser.firstName
    })
})

router.put('/', authMiddleware, async (req, res) => {
    const body = req.body;
    const validate = updateValidate.safeParse(body);
    console.log(validate);
    if (!validate.success) return res.status(411).json({
        message: validate?.error?.issues[0].message
    })
    console.log(req.userId);
    const update = await User.updateOne({
        _id: req.userId
    }, {
        $set: body
    })
    res.status(200).json({
        message: "update success",
        update
    })
})


router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || '';
    // console.log(req.headers.authorization);
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i"
            }
        },
        {
            lastName: {
                "$regex": filter,
                "$options": "i"
            }
        }
        ]
    })

    

    return res.json({
        "count" : users.length,
        users: users.map(u => ({
            username: u.username,
            firstName: u.firstName,
            lastName: u.lastName,
            _id: u._id
        }))
    });

})

module.exports = router;