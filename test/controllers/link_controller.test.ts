import { expect } from "chai";
import request from "supertest";
import { getApp } from "../../app";
import { getHandlers } from "../../src/backend/controllers/link_controller";
import { getUserRouter } from "../../src/backend/controllers/user_controller";

var api = request('http://localhost:3000');
var newUser = { email: Math.random().toString(36).substring(7)+"@gmail.com", password: "secret" };
var defaultUser = { email: "albertoorozco7@gmail.com", password: "secret" };
var token;
var newLink = { url: "www.biglink.com", title: "biglink" };
var newLinkId;

describe('UNIT TEST  /api/v1/users POST', () => {


 it('create a new user -  should return new user object', function(done)  {
     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){    
            try{
            expect(JSON.stringify(res.body)).to.equal(JSON.stringify(newUser))
            setTimeout(function(){}, 500);
            done();
             }
                catch (e) {
                    done(e);
                }
        });

})
it('create new user missing email -  should return string bad request', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser.password)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})
it('create new user missing password -  should return string bad request', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser.email)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})

it('create new user no data attached  -  should return string bad request' , function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! ")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})


it('create same new user  -  should return string bad request user already in the system', function(done)  {

     api.post('/api/v1/users')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! user already  in the system")
                done();
                }
                catch (e) {
                    done(e);
                }
            });

})
});


describe('INTEGRATON TEST - auth user, create link, upvotelink, and downvote link', () => {

 it('authentification of User - /api/v1/auth/login POST  authentification, should return a token', function(done){
    api.post('/api/v1/auth/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(defaultUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
                expect(!res.body.token).to.equal(false);
                token = res.body.token;
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
 it('add a new link - /api/v1/links POST add first new link, should return a link json', function(done){
    api.post('/api/v1/links')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send(newLink)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
                expect(res.body.url).to.equal(newLink.url)
                expect(res.body.title).to.equal(newLink.title)
                newLinkId = res.body.id;
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
 it('add a new link NO token - /api/v1/links POST add first new link, should return a link json', function(done){
    api.post('/api/v1/links')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '' )
        .send(newLink)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote a link - /api/v1/links/:id/upvote POST upvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("upvoted saved sucessfully!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote a link NO token - /api/v1/links/:id/upvote POST upvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('upvote same link - /api/v1/links/:id/upvote POST upvote a link, should return a error', function(done){
    api.post('/api/v1/links/'+newLinkId+'/upvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! upvote already registered")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})

it('downvote a link - /api/v1/links/:id/downvote POST downvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("downvoted saved sucessfully!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
it('downvote a link NO token- /api/v1/links/:id/downvote POST downvote a link, should return a string', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', '')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Forbidden!")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})

it('downvote same link - /api/v1/links/:id/downvote POST downvote a link, should return a error', function(done){
    api.post('/api/v1/links/'+newLinkId+'/downvote')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('authorization', token)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
        .end(

            function(err, res ){
                try{
               expect(res.text).to.equal("Bad Request! downvote already registered")
                done();
                }
                catch (e) {
                    done(e);
                }
            }
            );
})
});
