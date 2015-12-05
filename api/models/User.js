/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Promise = require('bluebird');

module.exports = {

  attributes: {

    channelURL: {
      type: 'string',
      required: true
    },

    phoneID: {
      type: 'string',
      required: true,
      unique: true
    },

    stocks:{
      collection: 'UserStock',
      via: 'owner'
    }

  },

  beforeCreate: function(user, cb) {

    Promise.all([
      User.destroy({phoneID: user.phoneID})
    ])
      .spread(function(destroyeduser) {

        if (destroyeduser[0] != null) {
          UserStock.destroy({owner: destroyeduser[0].id}).exec(function (err, destroyed) {

          });
        }
      })
      .catch(function(err){
        console.log(err);
      })
      .done(function(){
        console.log("");
        cb(null,user);
      });

  }
};

