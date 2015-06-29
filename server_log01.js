/*
  The file name has been hard coded in var file.
*/

var http = require('http');
var fs = require('fs');
var url = require('url');
var httpServer = http.createServer(handler);
httpServer.listen(8182);
console.log("Server Started at localhost:8182");
var io = require('socket.io')(httpServer);
var file = "/Users/prerakgupta/Documents/javascript/test.txt";
var contents = fs.readFileSync(file, "utf8", function(err, data){
        if(err)
            return console.log(err);
        else
            return data;
    });
contents = replace_newline(contents.toString());

var script = "<html>"+
"<head>"+
"<script src='https://cdn.socket.io/socket.io-1.3.5.js'></script>"+
"<script type='text/javascript'>"+
    "var socket = io('http://localhost:8182'); "+
    "socket.on('logs', function(data){"+
         "console.log('Appending' + data.val);"+
         "append(data.val); "+
    "});"+
"function append(data){"+
      "var div = document.getElementById('11');"+
      "div.innerHTML = div.innerHTML + data;"+
"};"+
"</script>"+
"</head>"+
"<body><div id = '11'>"+contents+
"</div></body>"+
"</html>";

var diff = "";

io.on('connection', function(socket){
        console.log("connected");
        updateLogs(socket);
});

function handler(req, res){
    res.writeHead(200)
    res.end(script);
}

function replace_newline(string){
    if(string!==""){
        var a = string.replace(/\n/gi, "<br/>");
        return a;
    }
    else
        return "";
}

function updateLogs(socket){
    fs.watchFile( file, function(curr, prev){
        if(curr.mtime!=prev.mtime){
            var contents_new = fs.readFileSync(file, "utf8", function(err, data){
                    if(err)
                        return console.log(err);
                    else
                        return data;
                });
            contents_new = replace_newline(contents_new);
            diff = contents_new.substring( (contents_new.indexOf(contents) + contents.length) );
            contents = contents_new;
	    socket.emit("logs", {val: diff});
        }
    });
}