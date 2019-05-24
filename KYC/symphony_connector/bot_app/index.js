const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');

/* Callback function when the BOT hears a request */
const botHearsRequest = ( event, messages ) => {

    messages.forEach( (message, index) => {

      let doc = nlp(message.messageText);

      if(message.user.firstName == 'Chengpeng')
      {
       let reply_message='Hello Team! Please review verified Trader\'s profile';

;
      Symphony.sendMessage( message.stream.streamId, reply_message+form, null, Symphony.MESSAGEML_FORMAT);

      }


      else{
      /* Find grettings */
      let doc_grettings = doc.match('(hello|hi|bonjour)').out('tags');
      let doc_help = doc.match('(test)').out('tags');
      let reply_message = '';
      if (doc_grettings.length>0) {
        reply_message = 'Hello ' + message.user.firstName + 'Please check your personal info first.';
        for (var key1 in message.user) {
          reply_message += `\n, ${key1}: ${message.user[key1]}`;
        }
         rely_message+=' Is it Correct';
      } else if (doc_help.length>0) {
        reply_message = "<messageML>Hello <b>test bold</b>!</messageML>";
      } else {
        reply_message = 'Sorry I don\'t know how to handle this yet. Please wait for our next available assistance to help with that';
      }

      Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);

      /* Detect & analyze request */
      SymphonyBotNLP.findPattern( doc, message );
    }

    })
}

/* Initialize BOT to Symphony */
Symphony.initBot(__dirname + '/config.json').then( (symAuth) => {
  Symphony.getDatafeedEventsService( botHearsRequest );
})

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Node.js World!');
}).listen(8080);
