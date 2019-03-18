process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const MongoTestDB = require('../src/models/mongo');

const should = chai.should();

chai.use(chaiHttp);

describe('testing display operations', () => {
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

    it('should display ALL restaurant names on /display GET', (done) => {
        const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Roma pizzeria','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':10});
        newRestaurant.save((err, data) => {     
          chai.request(server)
            .get('/display')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('NAMES');
              res.body.NAMES[0].should.have.property('name');
              res.body.NAMES[1].should.have.property('name');
              done();
            });
          });
    });
  
    it('should display a SINGLE restaurant on /display/<id> GET', (done) => {
      const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Holy Cow','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':100});
        newRestaurant.save((err, data) => {
        chai.request(server)
          .get('/display/'+data.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('name');
            res.body[0].name.should.equal('Holy Cow');
            res.body[0].id.should.equal(data.id);
            done();
          });
      });
    });

    it('should check availability before /display/<id> GET', (done) => {
      const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Holy Cow','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':100});
        newRestaurant.save((err, data) => {
        chai.request(server)
          .get('/display/18')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('EMPTY');
            done();
          });
      });
    });

    it('should display a SORTED list of restaurants on /display/sorted GET', (done) => {
        const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Stockholm pizzeria','price_level':2,'rating':4.6,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':99});
        newRestaurant.save((err, data) => {
        chai.request(server)
          .get('/display/sorted')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('SORTED');
            res.body.SORTED[0].should.have.property('name');
            res.body.SORTED[1].should.have.property('name');
            res.body.SORTED[0].should.have.property('rating');
            res.body.SORTED[1].should.have.property('rating');
            res.body.SORTED[0].rating.should.equal(4.9);
            res.body.SORTED[0].name.should.equal('China food house');
            res.body.SORTED[1].rating.should.equal(4.6);
            done();
          });
      });
    });

    it('should display a FILTERED list of restaurants on /display/filtered GET', (done) => {
        const newRestaurant = new MongoTestDB({'opening_hours':['Monday: 11:00 AM – 10:00 PM','Tuesday: 11:00 AM – 10:00 PM','Wednesday: 11:00 AM – 10:00 PM','Thursday: 11:00 AM – 10:00 PM','Friday: 11:00 AM – 10:00 PM','Saturday: 1:00 – 10:00 PM','Sunday: 1:00 – 10:00 PM'],'address':'Ringvägen 87, 118 61 Stockholm, Sweden','phone_number':'08-642 02 02','location':{'lat':59.30840209999999,'lng':18.0662221},'icon':'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png','name':'Napoli pizzeria','price_level':2,'rating':4.1,'google_maps_url':'https://maps.google.com/?cid=14782652209210814272','website':'http://theholycow.se/','photo':'https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg','id':79});
        newRestaurant.save((err, data) => {
        chai.request(server)
          .get('/display/filtered')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('FILTERED');
            res.body.FILTERED[0].should.have.property('name');
            res.body.FILTERED[0].should.have.property('rating');
            res.body.FILTERED[0].name.should.equal('China food house');
            res.body.FILTERED[0].rating.should.equal(4.9);
            done();
          });
      });
  });
});
