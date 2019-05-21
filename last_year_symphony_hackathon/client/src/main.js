var fs = require('fs')
    , path = require('path')
    , request = require('request')
    , _ = require('lodash');

var certOptions = {
    url: 'https://develop2-api.symphony.com:8444/sessionauth/v1/authenticate',
    // agentOptions: {
    //     pfx: fs.readFileSync(__dirname + '/bot.user110.p12'),
    //     passphrase: 'changeit'
    // },
    passphrase: 'changeit',
    cert: fs.readFileSync(__dirname + '/bot.user110-cert.pem'),
    key: fs.readFileSync(__dirname + '/bot.user110-key.pem'),
    rejectUnauthorized: false,
    insecure: true
};

// request.post(certOptions, function(response, sessionBody) {
//   console.log(JSON.parse(sessionBody.body).token);
// });

const sessionToken = 'eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJib3QudXNlcjExMCIsImlzcyI6InN5bXBob255Iiwic2Vzc2lvbklkIjoiNjAzODdhOWIwN2U1YTQzYzI2OWRiZDJhNWU1MmQyMzY0NmI0OTFlZjE3NWVjNjQyMjA1ZDBjNjAzYTZiMzJhNzlhNTExOWZjNTVhN2RmODA2YmZjZmJmODAzMmY5N2QzMDAwMDAxNjNjZTNiYWE1OTAwMDEzZDcwMDAwMDAxZGEiLCJ1c2VySWQiOiIzNDkwMjYyMjIzNDI2MTgifQ.VeOWK4HGz_E4PU_2IdYXG7F4cn6EFKKCDuOY7UnCPvNpyAMSGRyjDuRnJKg1F6hyNNQSzw08o5YdVv0i1W-B0JJHKxBskva-R_49BNnxbWpdAEC4fnsQginoZSn-PTK8u8NmhH1iYpKecJZP-hQuync314WyZdeVp2wjM6TQ8Bg1aemmXieOY2uD6ucleV8GPLiuUp1PnrKo0jhwo4xVZFSaGAjikC1AWoYz0t4RLMdU1If1L6zS2eAIeHxbM0yxdIIkW090vWp-085dzaEeOMxlROYZCa6TlW_LG7HHp0nJtUuilH-72Nn4eoUAlEwiwCUD2eDasDSAwic1Rq2RIQ';
const keyManagerToken = '0100c327debe28b5c61df854266258aa5aeb6b1ed08b6b4a04b87c1217097ec58b171d5df588e9564012f415cb0681b802b55db32e60fc236898a6c0c8f2343cc72282b076e6bea5a6bd9c49276a44f486b58c09f883631223b269c76ee3ba25c18ebd07239c1241bf7059aefb17c736499b50f4b5666941acb97e3b40a36b8d34393c4dd9d1d78dea627315a802032e83b314d4a850284a228bcf0cccc88bd50f91baddb359ce8fa0de091d05a013aa88bdeb9b791698007c1e052fc340';
const options = {};

certOptions.url = 'https://develop2-api.symphony.com:8444/keyauth/v1/authenticate';
// request.post(certOptions, function(res, keyAuthBody) {
//   options.url = 'https://develop2.symphony.com/agent/v4/datafeed/create';
//   options.headers = {
//     'sessionToken': sessionToken,
//     'keyManagerToken': keyManagerToken,
//     'content-type': 'application/json'
//   }
//   request.post(options, (err, res, body) => {
//     console.log(body);
//   });
// });


// const dataStreamId = 'a57c9eb1-5644-4275-abb5-8146208800d8';
// const dataStreamId = 'c823cf32-a79e-4af4-a41f-df3b3cf57bd0';
const dataStreamId = "8612b454-cb63-49ce-aa63-997dedf7da30";
// const dataStreamId = 'd06bcf76-c609-407c-ad40-ade5617b5718';

// 400 -> datafeed expiry


// certOptions.url = 'https://develop2-api.symphony.com:8444/keyauth/v1/authenticate';

// options.url = "https://develop2.symphony.com/pod/v3/room/search";
// options.headers = {
//   'sessionToken': sessionToken,
//   'content-type': 'application/json'
// }
// options.json = { query: 'GS' };
// request.post(options, function(err, roomResponse, roomBody) {
//   console.log(roomResponse.body.rooms[0].roomSystemInfo.id);
// });
// request.post(certOptions, function(er, keyAuthBody) {
//   request.post(options, function(err, roomResponse, roomBody) {
//     const opt = {
//       url: 'https://develop2.symphony.com/agent/v4/stream/'+roomResponse.body.rooms[0].roomSystemInfo.id+'/message/create',
//       headers: {
//         'sessionToken': sessionToken,
//         'keyManagerToken': JSON.parse(keyAuthBody.body).token,
//         'content-type': 'multipart/form-data'
//       }
//     }
//    
//     request.get('http://192.168.20.148:6312/sector/realtime', function (errrr, baseUrlResponse)
//     {
//         request.get('http://192.168.20.148:6312/'+baseUrlResponse.body).on('response', response => {
//           var type = response.headers["content-type"],
//               prefix = "data:" + type + ";base64,",
//               body = "";

//           response.setEncoding('binary');
//           response.on('end', function () {
//               var base64 = new Buffer(body, 'binary').toString('base64'),
//                   data = prefix + base64;
//               const res = request.post(opt, (err, bd, bds) => {
//                 console.log(bd);
//               });
//               res.form().append('message', '<messageML>'+'<img style="height: 800px;width: 700px;" src="'+data+'" /></messageML>');
//           });
//           response.on('data', function (chunk) {
//               if (response.statusCode == 200) body += chunk;
//           });
//         });
//     });
//   });
// });

const roomId = 'usWuf5HAkqACKECrWH5vg3___pw5vbPYdA';
const opt = {
  url: 'https://develop2.symphony.com/agent/v4/stream/'+roomId+'/message/create',
  headers: {
    'sessionToken': sessionToken,
    'keyManagerToken': keyManagerToken,
    'content-type': 'multipart/form-data'
  }
}

const sendMessage = (input) => {
  const command = _.trim(input.substring(0, _.indexOf(input, '(')));
  if (command === 'plotStock') {
    const ress = request.post(opt);
    ress.form().append('message', '<messageML>'+'Working on it...'+'</messageML>');
    const ticker = _.split(input, '"')[1];
    const startDate = _.split(input, '"')[3];
    const endDate = _.split(input, '"')[5];
    const url = 'http://192.168.20.148:6312/stock/'+ticker+'?start='+startDate+'&end='+endDate;
    request.get(url, function (errrr, baseUrlResponse)
    {
        request.get('http://192.168.20.148:6312/'+JSON.parse(baseUrlResponse.body).path).on('response', response => {
          var type = response.headers["content-type"],
              prefix = "data:" + type + ";base64, ",
              body = "";
  
          response.setEncoding('binary');
          response.on('end', function () {
              var base64 = new Buffer(body, 'binary').toString('base64'),
                  data = prefix + base64;
              const res = request.post(opt);
              res.form().append('message', '<messageML>'+'<img style="height: '+JSON.parse(baseUrlResponse.body).height+'px;width: '+JSON.parse(baseUrlResponse.body).width+'px;" src="'+data+'" /></messageML>');
          });
          response.on('data', function (chunk) {
              if (response.statusCode == 200) body += chunk;
          });
        });
    });
  } else if(command === 'plotFx') {
    const ress = request.post(opt);
    ress.form().append('message', '<messageML>'+'Working on it...'+'</messageML>');
    const ticker = _.split(input, '"')[1];
    const startDate = _.split(input, '"')[3];
    const endDate = _.split(input, '"')[5];
    const url = 'http://192.168.20.148:6312/fx/'+ticker+'?start='+startDate+'&end='+endDate;
    request.get(url, function (errrr, baseUrlResponse)
    {
        request.get('http://192.168.20.148:6312/'+JSON.parse(baseUrlResponse.body).path).on('response', response => {
          var type = response.headers["content-type"],
              prefix = 'data:' + type + ';base64, ',
              body = "";
  
          response.setEncoding('binary');
          response.on('end', function () {
              var base64 = new Buffer(body, 'binary').toString('base64'),
                  data = prefix + base64;
              const res = request.post(opt);
              res.form().append('message', '<messageML>'+"<img style='height: "+JSON.parse(baseUrlResponse.body).height+"px;width: "+JSON.parse(baseUrlResponse.body).width+"px;' src='"+data+"' /></messageML>");
          });
          response.on('data', function (chunk) {
              if (response.statusCode == 200) body += chunk;
          });
        });
    });
  } else if(command === 'plotCrypto') {
    const ress = request.post(opt);
    ress.form().append('message', '<messageML>'+'Working on it...'+'</messageML>');
    const tickerOne = _.split(input, '"')[1];
    const tickerTwo = _.split(input, '"')[3];
    const startDate = _.split(input, '"')[5];
    const endDate = _.split(input, '"')[7];
    const url = 'http://192.168.20.148:6312/crypto/'+tickerOne+'/'+tickerTwo+'?start='+startDate+'&end='+endDate;
    request.get(url, function (errrr, baseUrlResponse)
    {
        request.get('http://192.168.20.148:6312/'+JSON.parse(baseUrlResponse.body).path).on('response', response => {
          var type = response.headers["content-type"],
              prefix = 'data:' + type + ';base64, ',
              body = "";
  
          response.setEncoding('binary');
          response.on('end', function () {
              var base64 = new Buffer(body, 'binary').toString('base64'),
                  data = prefix + base64;
              const res = request.post(opt);
              res.form().append('message', '<messageML>'+"<img style='height: "+JSON.parse(baseUrlResponse.body).height+"px;width: "+JSON.parse(baseUrlResponse.body).width+"px;' src='"+data+"' /></messageML>");
          });
          response.on('data', function (chunk) {
              if (response.statusCode == 200) body += chunk;
          });
        });
    });
  } else if(command === 'compare') {
    const ress = request.post(opt);
    ress.form().append('message', '<messageML>'+'Working on it...'+'</messageML>');
    const tickerOne = _.split(input, '"')[1];
    const tickerTwo = _.split(input, '"')[3];
    const startDate = _.split(input, '"')[5];
    const endDate = _.split(input, '"')[7];
    const url = 'http://192.168.20.148:6312/compare/'+tickerOne+'/'+tickerTwo+'?start='+startDate+'&end='+endDate;
    request.get(url, function (errrr, baseUrlResponse)
    {
        request.get('http://192.168.20.148:6312/'+JSON.parse(baseUrlResponse.body).path).on('response', response => {
          var type = response.headers["content-type"],
              prefix = 'data:' + type + ';base64, ',
              body = "";
  
          response.setEncoding('binary');
          response.on('end', function () {
              var base64 = new Buffer(body, 'binary').toString('base64'),
                  data = prefix + base64;
              const res = request.post(opt);
              res.form().append('message', '<messageML>'+"<img style='height: "+JSON.parse(baseUrlResponse.body).height+"px;width: "+JSON.parse(baseUrlResponse.body).width+"px;' src='"+data+"' /></messageML>");
          });
          response.on('data', function (chunk) {
              if (response.statusCode == 200) body += chunk;
          });
        });
    });
  } else if (command === 'plotSector') {
    const ress = request.post(opt);
    ress.form().append('message', '<messageML>'+'Working on it...'+'</messageML>');
    const time = _.split(input, '"')[1];
    const url = 'http://192.168.20.148:6312/sector/'+time;
    request.get(url, function (errrr, baseUrlResponse)
    {
        request.get('http://192.168.20.148:6312/'+JSON.parse(baseUrlResponse.body).path).on('response', response => {
          var type = response.headers["content-type"],
              prefix = 'data:' + type + ';base64, ',
              body = "";
  
          response.setEncoding('binary');
          response.on('end', function () {
              var base64 = new Buffer(body, 'binary').toString('base64'),
                  data = prefix + base64;
              const res = request.post(opt);
              res.form().append('message', '<messageML>'+"<img style='height: "+JSON.parse(baseUrlResponse.body).height+"px;width: "+JSON.parse(baseUrlResponse.body).height+"px;' src='"+data+"' /></messageML>");
          });
          response.on('data', function (chunk) {
              if (response.statusCode == 200) body += chunk;
          });
        });
    });
  }
}


// request.post(certOptions, function(res, keyAuthBody) {
//   console.log(JSON.parse(keyAuthBody.body).token);
// });

const listen = () => {
    options.url = 'https://develop2.symphony.com/agent/v4/datafeed/'+dataStreamId+'/read';
    options.headers = {
      'sessionToken': sessionToken,
      'keyManagerToken': keyManagerToken
    };
    console.log('starting to listen');
    request.get(options).on('response', response => {
      if (response.statusCode === 200) {
        response.setEncoding('binary');

        response.on('data', function(chunk) {
            if(_.get(JSON.parse(new Buffer(chunk).toString()), 'initiator.user.userId') === 349026222342618) {
              console.log('Do nothing');
            } else {
              let messageRes = JSON.parse(new Buffer(chunk).toString())[0].payload.messageSent.message.message;
              messageRes = messageRes.replace('<div data-format="PresentationML" data-version="2.0" class="wysiwyg"><p>', '');
              messageRes = messageRes.replace('</p>', '');
              messageRes = messageRes.replace('</div>', '');
              sendMessage(messageRes);
            }
            // console.log(messageRes);
        });
        response.on('end', function() {
            // console.log(data);
            listen();
        });
      }
      console.log(response.statusCode);
    });
}

listen();

// 401 new session and key manager token
// 204 no-content
// 400 recreate the feed 
