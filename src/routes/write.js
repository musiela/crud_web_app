const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.post('/add', (req, res) => {
  const Data = new req.context.mongoOp(req.body);
  Data.save()
    .then(item => {
      if(Data.length === 0){
        res.json({'EMPTY' : 'empty content'});
      }
      else res.json({'ADDED' : Data});
    })
    .catch(err => {
      res.json({'FAILED' : err});
    });
});

router.delete('/:id', (req, res) => {
    req.context.mongoOp.find({id : req.params.id}, (err, data) => {
        if(err) {
            res.json({'ERROR' : err});
        }else if(data.length === 0){
            res.json({'No id' : 'such id does not exist'});
        }else {
            req.context.mongoOp.deleteOne({id : req.params.id}, (err, result) => {
                if(err) {
                   res.json({'ERROR': err});
                } else {
                   res.json({'REMOVED' : data});
                }
            });
        }
    });
  });
  
  module.exports = router;