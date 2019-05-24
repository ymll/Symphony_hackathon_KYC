const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');

const userStatus = {};

const questionTemplate={
 '1':'What\'s your name?',
 '2':'What\'s your company',
 '3':'What\'s your asset amount'

}

parseUserReply=(index, message)=>{
  if(index==0)
   userStatus.name=message;
 else if(index==1)
  userStatus.company=message;
 else if(index=3)
  userStatus.asset=meesage;
}
checkUser = (id,messages) => {
  Symphony.sendMessage( message.stream.streamId, 'next question', null, Symphony.MESSAGEML_FORMAT);
  if (userStatus.id == null ) {
    userStatus.id=id;
    userStatus.index=0;
    Symphony.sendMessage( message.stream.streamId, 'next question', null, Symphony.MESSAGEML_FORMAT);
      // 'name':message.user,
      // 'company':'gs',
      // 'asset':123,
      // 'count':0

  } else {
    parseUserReply(userStatus[index],message);
  Symphony.sendMessage( message.stream.streamId, questionTemplate[index], null, Symphony.MESSAGEML_FORMAT);
  }
}

/* Callback function when the BOT hears a request */
const botHearsRequest = ( event, messages ) => {

    messages.forEach( (message, index) => {

      let doc = nlp(message.messageText);




      /* Find grettings */
      let doc_grettings = doc.match('(hello|hi|bonjour)').out('tags');
      let doc_help = doc.match('(test)').out('tags');
      let doc_card = doc.match('(card)').out('tags');
      let doc_upload_file = doc.match('(upload)').out('tags');
      let reply_message = '';
      if (doc_grettings.length>0) {
        reply_message = 'Hello :' + message.messageText.toString() + 'Please help us to answer some questions.';
        /*
        for (var key1 in message.user) {
          reply_message += `\n, ${key1}: ${message.user[key1]}`;
        }
        */
        Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
        userStatus = checkUser(message.user.userId,message.messageText.toString());


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

     userStatus = checkUser(message.user.id,message);
      /* Detect & analyze request */
      SymphonyBotNLP.findPattern( doc, message );


    })
}

/* Initialize BOT to Symphony */
Symphony.initBot(__dirname + '/config.json').then( (symAuth) => {
  Symphony.getDatafeedEventsService( botHearsRequest );
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
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);
