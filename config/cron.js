var Promise = require('bluebird');
var wns = require('wns');

var options = {
  client_id: 'ms-app://s-1-15-2-7517944-2102956592-847385009-1620487831-2475186946-440704142-3222778260',
  client_secret: 'cdJpJ6kmSPpAYBPRECs2mFtYvuTZBGyy',
  headers: 'X-WNS-TTL: 610'
};


function getNewData(){
  var getStocks = Promise.promisify(UserStock.query);
  var stockvalues = {};
  var pro = Promise.defer();

  Promise.all([
    getStocks('SELECT DISTINCT name FROM UserStock')
  ])
    .spread(function(results) {
      var stocks = results.rows;
      var baseURL = 'http://finance.yahoo.com/d/quotes?f=l1&s=';

      async.each(stocks, function(stock, callback) {

        var request = require('request');
        request(baseURL + stock.name, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            stockvalues[stock.name] = body;
            callback();
          } else {
            callback("ERRO!");
          }
        });

      }, function(err){
        if( err ) {
          console.log('A URL failed to process');
          pro.reject();
        } else {
          pro.resolve(stockvalues);
        }
      });
    })
    .catch(function(err){
      console.log(err);
    })
    .done(function(){

    });

  return pro.promise;
}

var reloadData = function(){

  sails.log("Updating values......\n\n");

  Promise.all([
    getNewData()
  ])
    .spread(function(stockHash) {

      UserStock.find({}).populate('owner')
        .then(function(stockarray){

          stockarray.forEach(function(entry) {
            var realValue = stockHash[entry.name];

            // tile notification
            wns.sendTileSquareText02(entry.owner.channelURL, entry.name, realValue, options, function (error, result) {
              if (error)
                console.error(error);
              else
                console.log(result);
            });

            if( realValue > entry.max || realValue < entry.min){
              //toast notification
              console.log("ENVIAR NOTIFICACAO: " + entry.name + " PARA: " + entry.owner.channelURL);

              wns.sendToastText02(entry.owner.channelURL, "Pediu para ser notificado sobre " + entry.name +":", "Valor atual: " + realValue , options, function (error, result) {
                if (error)
                  console.error(error);
                else
                  console.log(result);
              });



            }

          });

        })
        .catch(function(err){
          sails.log.error(err);
        });

    })
    .catch(function(err){
      console.log(err);
    })
    .done(function(){
    });

}


module.exports.cron = {
  minuteJob: {
    schedule: '* * * * *',

    onTick: reloadData
  }
};
