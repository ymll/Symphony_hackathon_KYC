const Symphony = require('symphony-api-client-node');
const nlp = require('compromise');
const SymphonyBotNLP = require('./lib/SymphonyBotNLP');

/* Callback function when the BOT hears a request */
const botHearsRequest = ( event, messages ) => {

    messages.forEach( (message, index) => {

      let doc = nlp(message.messageText);

      /* Find grettings */
      let doc_grettings = doc.match('(hello|hi|bonjour)').out('tags');
      let doc_help = doc.match('(test)').out('tags');
      let reply_message = '';
      if (doc_grettings.length>0) {
        reply_message = 'Hello ' + message.user.firstName;
        for (var key1 in message.user) {
          reply_message += `\n, ${key1}: ${message.user[key1]}`;
        }
      } else if (doc_help.length>0) {
        reply_message = "Hello <b>test bold</b>!"; // No need Message ML Tag
      } else {
        reply_message = 'Sorry I don\'t know how to handle this yet. Please wait for our next available assistance to help with that';
      }
      Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);

      /* Detect & analyze request */
      SymphonyBotNLP.findPattern( doc, message );

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