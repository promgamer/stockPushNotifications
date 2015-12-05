/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    channelURL: {
      type: 'string',
      required: true
    },

    phoneID: {
      type: 'string',
      required: true
    },

    stocks:{
      collection: 'UserStock',
      via: 'owner'
    }

  }
};

