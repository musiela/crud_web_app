const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    req.context.mongoOp.find({}, { name : 1, _id:0 }, (err,data) => {
        if(err) {
            res.json({'ERROR' : err});
        } else {
            if(data.length === 0){
                res.json({'EMPTY' : 'No restaurants found'}); 
            }
            else res.json({'NAMES' : data});
        }
    });
});
  
router.get('/filtered', (req, res) => {
    req.context.mongoOp.find({ rating: { $gt: 4.2 }}, { name : 1, rating: 1, _id:0 }, (err,data) => {
        if(err) {
            res.json({'ERROR' : err});
        } else {
            if(data.length === 0){
                res.json({'ERROR' : 'Empty'}); 
            }
            else res.json({'FILTERED' : data});
        }
    });
});
  
router.get('/sorted', (req, res) => {
    req.context.mongoOp.find({}, { name : 1, rating : 1, _id:0 }, (err,data) => {
        if(err) {
            res.json({'ERROR' : err}); 
        } else {
            if(data.length === 0){
                res.json({'ERROR' : err});  
            }
            else res.json({'SORTED' : data});
        }
    }).sort( { rating: -1 , name: 1} ); 
});

router.get('/:id', (req, res) => {
    req.context.mongoOp.find({id : req.params.id}, (err,data) => {
        if(err) {
            res.json({'ERROR' : err}); 
        } else {
            if(data.length === 0){
                res.json({'EMPTY' : 'Restaurant not found'}); 
            }
            else res.json(data);
        }
    });
});

module.exports = router;