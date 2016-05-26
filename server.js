var http = require('http');
var URL = require('url');
var fs=require('fs');
var createHandler = require('gitlab-webhook-handler')
var handler = createHandler({ path: '/webhook' })
var webhook = null;

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })

  var arg = URL.parse(req.url,true).query;

  var JsonObj=JSON.parse(fs.readFileSync('./config.json'));
  var ObjList = JsonObj.list;
  var name = arg.name;
  webhook = ObjList[name];

  if(webhook == null){
    console.log("Project does not exist");
    res.statusCode = 404
    res.end('Project does not exist')
    return;
  }
  if(webhook.token != arg.token){
    console.log("Token is not correct");
    res.statusCode = 404
    res.end('Token is not correct')
    return;
  }


}).listen(7777)

console.log("Gitlab Hook Server running at http://0.0.0.0:7777/webhook");

// 执行系统命令
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
 
  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

// 错误处理
handler.on('error', function (err) {
    console.error('Error:', err.message)
})

//接收更新
handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);

    if(webhook){
      run_cmd('sh', ['./script/'+webhook.script], function(text){ console.log(text) });
    }
})

// 接收错误
handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})