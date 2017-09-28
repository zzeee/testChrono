<?php
/**
 * Created by PhpStorm.
 * User: a.zienko
 * Date: 26.09.2017
 * Time: 11:49
 */

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

if (isset($_GET["param"]) || isset($_GET["paramget"]) || isset($_GET["viewq"]) )
{
  $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
  $channel = $connection->channel();
if (isset($_GET["param"])) {
  //echo($_GET["param"] . "!");
  $dataparam=$_GET["param"];

  $channel->queue_declare('hello', false, false, false, false);
  $msg = new AMQPMessage($dataparam);
  $channel->basic_publish($msg, '', 'hello');


  $channel->exchange_declare('logs2', 'fanout', false, false, false);
  list($queue_name, ,) = $channel->queue_declare("");
  $channel->queue_bind($queue_name, 'logs2');
  $channel->basic_publish($msg, 'logs2',"QWER");

  $channel->exchange_declare('topic_logs', 'topic', false, false, false);

  $routing_key = 'qwe.anonymous.info';

  $channel->basic_publish($msg, 'topic_logs', $routing_key);




//echo(json_encode(array("arr"=>'sent')));
    $channel->basic_consume('hello2', '', false, true, false, false, function($msg) {
    echo(json_encode(array("url"=>$_GET["param"],"data"=>$msg->body)));  });

  if (count($channel->callbacks)) {    $channel->wait(null,false,50);  }

//while(count($channel->callbacks)) {    $channel->wait();$i++;echo($i."\n"); if ($i>10) die();}
  /*

  $callback = function($msg) {
    echo " [x] Received ", $msg->body, "\n";
  };
  $channel->basic_consume('dataquee', '', false, true, false, false, $callback);

  while(count($channel->callbacks)) {
    $channel->wait();
  }*/

//  echo json_encode(array("url"=>$dataparam,"data"=>"dataarr"));

}



if (isset($_GET["paramget"])) {
  $channel->basic_consume('hello', '', false, true, false, false, function($msg) {  echo  (json_encode($msg->body));});
  if (count($channel->callbacks)) {    $channel->wait(null,false,50);  }
}

if (isset($_GET["viewq"])) {
  $channel->basic_consume('hello', '', false, true, false, false, function($msg) {  echo  (json_encode($msg->body));});
  $channel->basic_consume('hello2', '', false, true, false, false, function($msg) {  echo  (json_encode($msg->body));});
  if (count($channel->callbacks)) {    $channel->wait(null,false,50);  }

}
  die();
}



?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <!--
    manifest.json provides metadata used when your web app is added to the
    homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
  -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  <!--
    Notice the use of %PUBLIC_URL% in the tags above.
    It will be replaced with the URL of the `public` folder during the build.
    Only files inside the `public` folder can be referenced from the HTML.

    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
    work correctly both with client-side routing and a non-root public URL.
    Learn how to configure a non-root public URL by running `npm run build`.
  -->
  <title>Test Chrono</title>
</head>
<body>
<noscript>
  You need to enable JavaScript to run this app.
</noscript>
<div id="root"></div>
<!--
  This HTML file is a template.
  If you open it directly in the browser, you will see an empty page.

  You can add webfonts, meta tags, or analytics to this file.
  The build step will place the bundled scripts into the <body> tag.

  To begin the development, run `npm start` or `yarn start`.
  To create a production bundle, use `npm run build` or `yarn build`.
-->
</body>
<script type="text/javascript" src="http://localhost:3000//static/js/bundle.js"></script>

</html>

