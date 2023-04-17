const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

// Load Profile Model
const Card = require('../../models/Card');
// Load User Model
const User = require('../../models/User'); 

/* --------------------------for image uploads------------------------ */
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage'); 
const Grid = require('gridfs-stream');
const mongoURI = 'mongodb://localhost:27017/manis';
const conn = mongoose.createConnection(mongoURI);
let gfs; 
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
}); 
// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = { 
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: {
                        cardid: req.body.cardid, 
                        primeImg: "",
                     } 
                };
                console.log("METATDATA-------------------: ", fileInfo.metadata)
                if (fileInfo.metadata.cardid === undefined) return ("cardid not set properly");
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
/* --------------------------for image uploads------------------------ */

// @route GET /files
// @desc  Display all files in JSON
router.get('/getImgs', (req, res) => {
    //console.log(req.query.card_id)  
  
    gfs.files.find({ "metadata.cardid" : req.query.card_id }).toArray((err, files) => {
      // Check if files
        if (!files || files.length === 0) {
            /* return res.status(404).json({
                err: 'No files exist'
            }); */
            console.log("no images");
        } 
        // Files exist
        return res.json(files);
    });
});

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});
// @route DELETE /files/:id
// @desc  Delete file
router.delete('/removeImg/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        return res.json("success");
    });
});
// @route POST /addCarImg
// @desc  add card image file to DB
router.post('/addCardImg', upload.single('file'), async (req, res) => {
        //req.file.card_id = req.body.id;
        //console.log(req.file); 
        res.json("success"); 
});  



 

// @route       POST api/cards/deleteFullCard
// @desc        remove full card data and images related
// @access      Private
router.post('/deleteFullCard', (req, res) => {
    const errors = {};
    //console.log(req.body)

    // remove the card images
    // gfs.files.find({ "metadata.cardid" : req.body.card_id }).toArray((err, files) => {
    //     // Check if files
    //     if (!files || files.length === 0) {
    //         return res.status(404).json({
    //             err: 'No files exist'
    //         }); 
    //     }
    //     for (var i=0; i<files.length;i++) {
    //         console.log(files[i]._id)
    //         gfs.deleteOne({ _id: files[i]._id, root: 'uploads' }, (err) => {
    //             if (err) return res.json(err);
    //         });
    //     }
    //     return res.json(files);   
    // });
 
    // remove the card info
    Card.deleteOne({ _id: req.body.card_id }) 
    .then(cards => {
        if (!cards) {
            errors.noprofile = "There was no card with this id";
            return res.status(404).json(errors);
        } 
        return res.json(cards);
    })
    .catch(err=>res.status(404).json({cards: 'There are no cards'}));
}); 


// @route       GET api/cards/editCar
// @desc        get specific card for form data
// @access      Public
router.get('/getCardData', (req, res) => {
    const errors = {};

    //console.log(req.query)
    Card.find({ _id: req.query.card_id }) 
    .then(cards => {
        if (!cards) {
            errors.noprofile = "There are no cards";
            return res.status(404).json(errors);
        }
        res.json(cards);
    })
    .catch(err=>res.status(404).json({cards: 'There are no cards'}));
}); 
// @route       GET api/cards/cards
// @desc        cards route
// @access      Public
router.get('/cardList', (req, res) => {
    const errors = {};

    Card.find() 
    .then(cards => {
        if (!cards) {
            errors.noprofile = "There are no cards";
            return res.status(404).json(errors);
        }
        res.json(cards);
    })
    .catch(err=>res.status(404).json({cards: 'There are no cards'}));
});


// @route       POST api/Card/addCard
// @desc        Create || Edit Card
// @access      Private
router.post('/addCard', passport.authenticate('jwt', { session: false }), (req, res) => { 
    const cardFields = {};
    if(req.body.strain) cardFields.strain = req.body.strain;
    if(req.body.type) cardFields.type = req.body.type;
    if(req.body.name) cardFields.name = req.body.name;
    if(req.body.thc) cardFields.thc = req.body.thc;
    if(req.body.cbd) cardFields.cbd = req.body.cbd;
    if(req.body.description) cardFields.description = req.body.description;
    if(req.body.amount) cardFields.amount = req.body.amount;
    if(req.body.price) cardFields.price = req.body.price;
 
    // Save Card, and return the response (Card) 
    // Find specific id
    Card.findOne({_id: req.body.card_id}).then(Card => {
        console.log(Card)
        if (Card) { // Edit - if Card exists... also creates record if not.
            Card.findOneAndUpdate(
                { _id: req.body.card_id }, 
                { $set: cardFields },  
            ).then(Card => res.json(Card));
        } else { // Create - if Card doesnt exist 
            //dont need to because it should already be created
            //new Card(cardFields).save().then(Card => { res.json(Card) });
        }
    });
});

// router.post('/addCard', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const cardFields = {};
//     if(req.body.strain) cardFields.strain = req.body.strain;
//     if(req.body.type) cardFields.type = req.body.type;
//     if(req.body.name) cardFields.name = req.body.name;
//     if(req.body.thc) cardFields.thc = req.body.thc;
//     if(req.body.cbd) cardFields.cbd = req.body.cbd;
//     if(req.body.description) cardFields.description = req.body.description;
//     if(req.body.amount) cardFields.amount = req.body.amount;
//     if(req.body.price) cardFields.price = req.body.price;

//     new Card(cardFields).save().then(card => { 
//         if (card) res.json(card)
//         else res.json("err")
//     });
// });


module.exports = router;