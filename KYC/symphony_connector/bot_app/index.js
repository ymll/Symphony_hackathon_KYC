const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');
const html_utils = require('./html-utils');

const userStatus = {};

const questionTemplate = {
  0: 'What\'s your company?',
  1: 'What\'s your department at your company?',
  2: 'What\'s your title at your company?',
  3: 'What\'s your national ID number?',
  4: 'What\'s your full address?',
  5: 'What\'s your phone number?',
  6: 'What\'s your asset amount?',
  7: 'Please upload a supporting document from <a href=\"http://localhost:8080\">here</a> and type anything.'
}

parseUserReply = (index, messageText, message) => {
  id = message.user.userId;
  switch (index) {
    case 0:
      userStatus[id].company = messageText;
    case 1:
      userStatus[id].department = messageText;
    case 2:
      userStatus[id].position = messageText;
    case 3:
      userStatus[id].national_Id = messageText;
    case 4:
      userStatus[id].address = messageText;
    case 5:
      userStatus[id].phone_number = messageText;
    case 6:
      userStatus[id].asset = messageText;
    case 7:
      {

      }
  }
}

isNewUser = (id) => {
  let temp = userStatus[id];
  return userStatus[id] == undefined;
}

getQuestion = (message) => {
  id = message.user.userId;
  messageText = message.messageText.toString();
  if (isNewUser(id)) {
    userStatus[id] = {};
    userStatus[id].index = 0;
  } else {
    parseUserReply(userStatus[id].index, messageText, message);
    userStatus[id].index += 1;
  }

  if (userStatus[id].index > Object.keys(questionTemplate).length - 1) {
    var options = {
      method: 'POST',
      url: 'http://192.168.0.112:5000/api/v1/user/create',
      headers:
      {
        'postman-token': 'f84139e7-9b85-b2d4-4422-725c59b5479c',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData:
      {
        company: 'Symphony',
        phone: '+1(234)567-8901',
        national_id: '123436533',
        email: message.user.email,
        identity: 'individual',
        address: 'Hong Kong',
        position: 'Trader',
        division: 'Trading Division',
        doc_path: '',
        id: id
      }
    };
    return 'Thank you for your information.';
  } else {
    return questionTemplate[userStatus[id].index];
  }
}

sendMessage = (msgObj, text) => {
  Symphony.sendMessage(msgObj.stream.streamId, text, null, Symphony.MESSAGEML_FORMAT);
}

/* Callback function when the BOT hears a request */
const botHearsRequest = (event, messages) => {

  messages.forEach((message, index) => {

    let doc = nlp(message.messageText);


    /* Find grettings */
    let doc_grettings = doc.match('(hello|hi|bonjour)').out('tags');
    let doc_help = doc.match('(test)').out('tags');
    let doc_card = doc.match('(card)').out('tags');
    let doc_table = doc.match('(table)').out('tags');
    let doc_upload_file = doc.match('(upload)').out('tags');
    let reply_message = '';
    if (!isNewUser(message.user.userId)) {
      reply_message = getQuestion(message);
      sendMessage(message, reply_message);
    } else if (doc_grettings.length > 0) {
      request('http://localhost:5000/api/v1/user?id=1001', { json: true }, (error, response, body) => {
        reply_message = "Hello " + message.user.firstName + ",<br/>Checking whether you are verified or not...<br/><br/>";
        if (!error && response.statusCode == 200) {
          if (body.verified) {
            reply_message += 'Confirm in system that you are verified to trade';
          } else {
            reply_message += `You are not authorized to action. Verify Status: ${body.verify_status}`;
          }
          sendMessage(message, reply_message);
          if(!body.verified)
          {

            sendMessage(message, questionTemplate[7]);

          }
        }
        else {
          reply_message += 'You are not authorized to action. Verify Status: No User Found<br/>Please help us to answer some questions to process your onboarding.<br/><br/>';
          reply_message += getQuestion(message);
          sendMessage(message, reply_message);
        }
      })
    } else if (doc_help.length > 0) {
      reply_message = "This is a <b>messageML</b>! message"; // No need Message ML Tag
      sendMessage(message, reply_message);
    } else if (doc_card.length > 0) {
      reply_message = html_utils.generateCard('Card Header. Always visible.', 'Card Body. User must click to view it.', './images/favicon.png');
      sendMessage(message, reply_message);
    } else if (doc_table.length > 0) {
      reply_message = html_utils.generateTable([['col1', 'col2', 'col3'], ['data1', 'data2', 'data3']]);
      sendMessage(message, reply_message);
    }
    else if (doc_upload_file.length > 0) {
      reply_message = "Click this <a href=\"http://localhost:8080\">link</a> to uploade file";
      sendMessage(message, reply_message);
    }
    else {
      reply_message = 'Sorry I don\'t know how to handle this yet. Please wait for our next available assistance to help with that';
      sendMessage(message, reply_message);
    }

    /* Detect & analyze request */
    SymphonyBotNLP.findPattern(doc, message);
  })
}

/* Initialize BOT to Symphony */
Symphony.initBot(__dirname + '/config.json').then((symAuth) => {
  Symphony.getDatafeedEventsService(botHearsRequest);
})

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var request = require('request');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'uploaded_files/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html_utils.generateUploadForm());
    return res.end();
  }
}).listen(8080);
