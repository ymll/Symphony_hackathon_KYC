const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');

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

<<<<<<< HEAD
parseUserReply=(index, message)=>{
  if(index==0)
   userStatus.name=message;
 else if(index==1)
  userStatus.company=message;
 else if(index ==2)
  userStatus.asset=meesage;
}
checkUser = (id,message) => {
  Symphony.sendMessage( message.stream.streamId, 'next question', null, Symphony.MESSAGEML_FORMAT);
  if (userStatus.id == null ) {
    userStatus.id=id;
    userStatus.index=0;
    Symphony.sendMessage( message.stream.streamId, 'next question', null, Symphony.MESSAGEML_FORMAT);
      // 'name':message.user,
      // 'company':'gs',
      // 'asset':123,
      // 'count':0
=======
isNewUser = (id) => {
  return userStatus[id] == undefined;
}
>>>>>>> afaeb7d766cb613f20b8b8538fe75f52d879799a

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
<<<<<<< HEAD
  parseUserReply(userStatus[index],message);
  Symphony.sendMessage( message.stream.streamId, questionTemplate[index], null, Symphony.MESSAGEML_FORMAT);
  }
}

/* Callback function when the BOT hears a request */
const botHearsRequest = ( event, messages ) => {

    messages.forEach( (message, index) => {

      let doc = nlp(message.messageText);

      if(message.user.firstName == 'Julia')
      {
        Symphony.sendMessage( message.stream.streamId, "Please check whether trader is verified or not", null, Symphony.MESSAGEML_FORMAT);

        fetch("http://localhost:50000/api/v1/users").then(response => {
   Symphony.sendMessage( message.stream.streamId, response, null, Symphony.MESSAGEML_FORMAT);
  if (response.ok) {
  Symphony.sendMessage( message.stream.streamId, "GET RESPONSE", null, Symphony.MESSAGEML_FORMAT);
    return response
  }
  return Promise.reject(Error('error'))
}).catch(error => {
  return Promise.reject(Error(error.message))
})
Symphony.sendMessage( message.stream.streamId, "After Fetch", null, Symphony.MESSAGEML_FORMAT);


      }


      /* Find grettings */
      let doc_grettings = doc.match('(hello|hi|bonjour)').out('tags');
      let doc_help = doc.match('(test)').out('tags');
      let doc_card = doc.match('(card)').out('tags');
      let doc_upload_file = doc.match('(upload)').out('tags');
      let reply_message = '';
      if (doc_grettings.length>0) {
        reply_message = 'Hello :' + message.user.firstName + 'Please help us to answer some questions.';
        /*
        for (var key1 in message.user) {
          reply_message += `\n, ${key1}: ${message.user[key1]}`;
        }
        */
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
        checkUser(message.user.userId,message.messageText.toString());


      } else if (doc_help.length>0) {
        reply_message = "This is a <b>messageML</b>! message"; // No need Message ML Tag
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
      } else if(doc_card.length>0) {
        reply_message = "<h2>Cards</h2> <card accent=\"tempo-bg-color--blue\" iconSrc=\"./images/favicon.png\"> <header>Card Header. Always visible.</header> <body>Card Body. User must click to view it.</body> </card>";
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
      } else if(doc_upload_file.length>0) {
        reply_message = "Click this <a href=\"http://localhost:8080\">link</a> to uploade file";
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
      }
      else {
        reply_message = 'Sorry I don\'t know how to handle this yet. Please wait for our next available assistance to help with that';
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
      }
=======
    parseUserReply(userStatus[id], messageText);
    userStatus[id] += 1;
  }
>>>>>>> afaeb7d766cb613f20b8b8538fe75f52d879799a

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
<<<<<<< HEAD
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
=======
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html_utils.generateUploadForm());
>>>>>>> afaeb7d766cb613f20b8b8538fe75f52d879799a
    return res.end();
  }
}).listen(8080);
