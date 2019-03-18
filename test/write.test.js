process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const MongoTestDB = require('../src/models/mongo');

const should = chai.should();

chai.use(chaiHttp);

describe('testing write operations', () => {
    beforeEach((done) => {
        const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'China food house','price_level':1,'rating':4.9,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':979});
        newRestaurant.save((err) =>  {
        done();
        });
    });

    afterEach((done) =>{
      MongoTestDB.collection.drop();
        done();
    });

    it('should add a SINGLE restaurant on /write/add POST', (done) => {
     chai.request(server)
      .post('/write/add')
      .send({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Linkoping food house','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':979})
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('ADDED');
        res.body.ADDED.should.be.a('object');
        res.body.ADDED.should.have.property('id');
        res.body.ADDED.should.have.property('name');
        res.body.ADDED.id.should.equal(979);
        res.body.ADDED.name.should.equal('Linkoping food house');
        done();
      });
    });

    it('should check if id is provided before /write/add POST', (done) => {
     chai.request(server)
      .post('/write/add')
      .send({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Linkoping food house','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id': null})
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('FAILED');
        done();
      });
    });

    it('should delete a SINGLE restaurant on /write/<id> DELETE', (done) => {
      const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Gamla food house','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':999});
      newRestaurant.save((err, data) => {
      chai.request(server)
      .get('/display')  
      .end((err, res) =>{
        chai.request(server)
          .delete('/write/999')  
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('REMOVED');
            res.body.REMOVED[0].should.have.property('name');
            res.body.REMOVED[0].id.should.equal(999);
            done();
           });
       });
      }); 
    });

    it('should check availability before /write/<id> DELETE', (done) => {
      const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Gamla food house','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':999});
      newRestaurant.save((err, data) => {
      chai.request(server)
       .get('/display')  
       .end((err, res) => {
          chai.request(server)
          .delete('/write/99')  
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('No id');
            done();
           });
        });
      }); 
    });
});
