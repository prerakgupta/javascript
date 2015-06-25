/*
  The filepath is hard coded.
  just run localhost:8182 and then make changes to file specified above.

*/
var http = require('http');
var fs = require('fs');
var url = require('url');
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
"<script type='text/javascript'>"+
"function init(){"+
    "myRequest = new XMLHttpRequest();"+
    "var url = 'http://localhost:8182/logs';"+
    "myRequest.open('get',url);"+
    "myRequest.send(null);"+
    "myRequest.onreadystatechange=function(){"+
         "if ( myRequest.status == 200 && myRequest.readyState==4 ){"+
               "var data = myRequest.responseText;"+
               "var div = document.getElementById('11');"+
               "div.innerHTML = div.innerHTML + data;"+
               "data = ''; "+
         "}"+
    "}"+
"};"+
"setInterval(init, 2000);"+
"</script>"+
"</head>"+
"<body><div id = '11'>"+contents+
"</div></body>"+
"</html>";

var diff = "";
var server = http.createServer(function(req, res){
	var path = url.parse(req.url).pathname;
	if(path==="/logs"){
     	    res.end(diff);
	    if(diff!=="")
		diff = "";
	}
	else
	    res.end(script);

});
server.listen(8182);
console.log("Server started at localhost:8182");

function replace_newline(string){
    if(string!==""){
	var a = string.replace(/\n/gi, "<br/>");
	return a;
    }
    else
	return "";
}

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
	}
});