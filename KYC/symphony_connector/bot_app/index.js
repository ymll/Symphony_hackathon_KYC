const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');
const html_utils = require('./html-utils');

const userStatus = {};

const questionTemplate = {
  0: 'What\'s your name?',
  1: 'What\'s your company?',
  2: 'What\'s your asset amount?',
  3: 'Please upload a supporting document from <a href=\"http://localhost:8080\">here</a> and type anything.'
}

parseUserReply = (index, message) => {
  switch (index) {
    case 0:
      userStatus.name = message;
    case 1:
      userStatus.company = message;
    case 2:
      userStatus.asset = message;
    case 3:
      {

      }
  }
}

isNewUser = (id) => {
  return userStatus[id] == undefined;
}

getQuestion = (message) => {
  id = message.user.userId;
  messageText = message.messageText.toString();
  if (isNewUser(id)) {
    userStatus[id] = 0;
    // 'name':message.user,
    // 'company':'gs',
    // 'asset':123,
    // 'count':0
  } else {
    parseUserReply(userStatus[id], messageText);
    userStatus[id] += 1;
  }

  if (userStatus[id] > Object.keys(questionTemplate).length - 1) {
    return 'Thank you for your information.';
  } else {
    return 'Next Question: <br/>' + questionTemplate[userStatus[id]];
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
      reply_message = 'Hello ' + message.user.firstName + ',<br/>' + 'Please help us to answer some questions.<br/><br/>';
      reply_message += getQuestion(message);
      sendMessage(message, reply_message);
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
