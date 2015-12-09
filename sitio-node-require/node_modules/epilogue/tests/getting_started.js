'use strict';

var Promise = require('bluebird'),
    request = require('request'),
    expect = require('chai').expect,
    rest = require('../lib'),
    test = require('./support');

describe('Getting Started', function() {
  before(function() {
    test.models.User = test.db.define('User', {
      username: test.Sequelize.STRING,
      birthday: test.Sequelize.DATE
    });
  });

  beforeEach(function() {
    return Promise.all([ test.initializeDatabase(), test.initializeServer() ])
      .then(function() {
        rest.initialize({ app: test.app, sequelize: test.Sequelize });
        test.userResource = rest.resource({
          model: test.models.User,
          endpoints: ['/users', '/users/:id']
        });
      });
  });

  afterEach(function() {
    return test.clearDatabase()
      .then(function() { return test.closeServer(); });
  });

  it('should support the create action', function(done) {
    request.post({
      url: test.baseUrl + '/users',
      json: { username: 'sudhakar', birthday: '1975-15-05', updatedAt: '2015-10-10', createdAt: '2015-10-11' }
    }, function(err, response, body) {
      expect(err).to.be.null;
      expect(response.statusCode).to.equal(201);
      console.log(body);
      done();
    });
  });

  it('should support the read action', function() {

  });

  it('should support the update action', function() {

  });

  it('should support the list action', function() {

  });

  it('should support the delete action', function() {

  });

});
