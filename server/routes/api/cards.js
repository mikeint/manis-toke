const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

// Load Profile Model
const Card = require('../../models/Card');

/* --------------------------for image uploads------------------------ */
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoURI = 'mongodb://localhost:27017/manis';
const conn = mongoose.createConnection(mongoURI);
mongoose.set('useFindAndModify', false);

// Create storage engine
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log("file: ", file)
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});
const upload = multer({ storage: storage });
/* --------------------------for image uploads------------------------ */

// @route       POST api/cards/deleteFullCard
// @desc        remove full card data and images related
// @access      Private
router.post('/deleteFullCard', (req, res) => {
    const errors = {};

    // remove the card info
    Card.findOneAndDelete({ _id: req.body.card_id })
        .then((cards) => {
            if (!cards) {
                errors.noprofile = 'There was no card with this id';
                return res.status(404).json(errors);
            }
            return res.json(cards);
        })
        .catch((err) => res.status(404).json({ cards: 'There are no cards' }));
});

// @route       GET api/cards/editCar
// @desc        get specific card for form data
// @access      Public
router.get('/getCardData', (req, res) => {
    const errors = {};

    //console.log(req.query)
    Card.find({ _id: req.query.card_id })
        .then((cards) => {
            if (!cards) {
                errors.noprofile = 'There are no cards';
                return res.status(404).json(errors);
            }
            res.json(cards);
        })
        .catch((err) => res.status(404).json({ cards: 'There are no cards' }));
});

// @route       GET api/cards/cards
// @desc        cards route
// @access      Public
router.get('/cardList', (req, res) => {
    const errors = {};

    Card.find()
        .then((cards) => {
            if (!cards) {
                errors.noprofile = 'There are no cards';
                return res.status(404).json(errors);
            }
            res.json(cards);
        })
        .catch((err) => res.status(404).json({ cards: 'There are no cards' }));
});

// @route       GET api /card/image
// @desc        get company image
// @access      Public
router.get('/image/:cardid/:field', (req, res) => {
    const { cardid, field } = req.params;

    Card.findOne({ _id: cardid })
        .then((card) => res.header('contentType', card[field].contentType).send(card[field].data))
        .catch((err) => {
            console.log(err);
            res.status(404).json({ cards: 'There is no card image' });
        });
});

// @route       POST api/Card/addCard
// @desc        Create || Edit Card
// @access      Private
router.post('/addCard', upload.single('company_image'), passport.authenticate('jwt', { session: false }), (req, res) => {
    const cardFields = {};
    if (req.body.strain) cardFields.strain = req.body.strain;
    if (req.body.type) cardFields.type = req.body.type;
    if (req.body.name) cardFields.name = req.body.name;
    if (req.body.nameCross) cardFields.nameCross = req.body.nameCross;
    if (req.body.thc) cardFields.thc = req.body.thc;
    if (req.body.cbd) cardFields.cbd = req.body.cbd;
    if (req.body.description) cardFields.description = req.body.description;
    if (req.body.amount) cardFields.amount = req.body.amount;
    if (req.body.price) cardFields.price = req.body.price;
    if (req.body.newCheckBtn != null) cardFields.newCheckBtn = req.body.newCheckBtn;
    if (req.body.recommendCheckBtn != null) cardFields.recommendCheckBtn = req.body.recommendCheckBtn;
    if (req.body.onFire != null) cardFields.onFire = req.body.onFire;
    if (req.body.disabled != null) cardFields.disabled = req.body.disabled;

    if (req.file) {
        cardFields.company_image = {
            data: fs.readFileSync(path.join(__dirname, '../../uploads/' + req.file.filename)),
            contentType: req.file.mimetype,
        };
    }

    // Save Card, and return the response (Card)
    // If the id exists
    if (req.body.card_id) {
        //console.log("already created: ",cardFields)
        Card.findOneAndUpdate({ _id: req.body.card_id }, { $set: cardFields }).then((Card) => res.json(Card));
        // Else make new record
    } else {
        //console.log("NEW: ", cardFields);
        new Card(cardFields).save().then((card) => {
            if (card) res.json(card);
            else res.json('err');
        });
    }
});

module.exports = router;
