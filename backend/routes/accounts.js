const express = require('express');
const authMiddleware = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "this is account route"
    })
})

router.get('/balance', authMiddleware, async (req, res) => {
    console.log('this goes here');
    const userId = req.userId;
    try {
        const accData = await Account.findOne({
            userId: userId
        })

        console.log(accData);
        return res.status(200).json({
            message: "success",
            "balance": accData.balance
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "internal server error"
        })
    }

})


router.post('/transfer', authMiddleware, async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    const { to, amount } = req.body;
    
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    console.log(account);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    }).session(session)
    // console.log(toAccount, 'running');
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(404).json({
            message: "account doesn't exist"
        })
    }

    await Account.updateOne({
        userId: req.userId,
    }, {
        '$inc': {
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        '$inc': {
            balance: amount
        }
    }).session(session);

    await session.commitTransaction();
    return res.status(200).json({
        message: "transfer success"
    })
})
// router.post("/transfer", authMiddleware, async (req, res) => {
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to } = req.body;

//     const account = await Account.findOne({ userId: req.userId }).session(session);

//     if (!account || account.balance < amount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Insufficient balance"
//         });
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Invalid account"
//         });
//     }

//     // Perform the transfer
//     await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//     // Commit the transaction
//     await session.commitTransaction();

//     res.json({
//         message: "Transfer successful"
//     });
// });

module.exports = router;