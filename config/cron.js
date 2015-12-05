var Promise = require('bluebird');
var  AppID = 'ms-app://s-1-15-2-7517944-2102956592-847385009-1620487831-2475186946-440704142-3222778260';
var  AppSecret = 'cdJpJ6kmSPpAYBPRECs2mFtYvuTZBGyy';

var createApps = function(){

  Promise.all([

  ])
    .spread(function(){
      //do nothing
    })
    .catch(function(err){
      console.log(err);
    })
    .done(function(){
      console.log("");
    });

}








module.exports.cron = {
  /*dailyJob: {
    schedule: '0 0 * * *',

    onTick: createDailyTimeTable
  },*/

  oneTimeJob: {
    schedule: new Date(new Date().getTime() + 7000),

    onTick: createApps
  }
};
