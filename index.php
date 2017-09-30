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

/** Мини rpc-кролик-клиент */
class CsvRpcClient
{
    private $connection;
    private $channel;
    private $callback_queue;
    private $response;
    private $corr_id;

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection(
            'localhost', 5672, 'guest', 'guest');
        $this->channel = $this->connection->channel();
        list($this->callback_queue, ,) = $this->channel->queue_declare(
            "", false, false, true, false);
        $this->channel->basic_consume(
            $this->callback_queue, '', false, false, false, false,
            array($this, 'on_response'));
    }

    public function on_response($rep)
    {
        if ($rep->get('correlation_id') == $this->corr_id) {
            $this->response = $rep->body;
        }
    }

    public function call($n)
    {
        $this->response = null;
        $this->corr_id = uniqid();
        $msg = new AMQPMessage(
            (string)$n,
            array('correlation_id' => $this->corr_id,
                'reply_to' => $this->callback_queue)
        );
        $this->channel->basic_publish($msg, '', 'rpc_queue');
        while (!$this->response) {
            $this->channel->wait();
        }
        return ($this->response);
    }
}
;


if (isset($_GET["param"]) || isset($_GET["paramget"]) || isset($_GET["viewq"]) || isset($_GET["testq"])) {
    $c_rpc = new CsvRpcClient();
    if (isset($_GET["param"])) {
        $dataparam = $_GET["param"];
        $response = $c_rpc->call($dataparam);
        echo(json_encode(array("url" => $_GET["param"], "data" => $response)));
    }


    if (isset($_GET["testq"])) { // Только для целей тестиования
        echo(json_encode(array("res" => "phptestok")));
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
    <style type="text/css">
        html, body {
            height: 100%;
            width: 100%;
            padding-left: 10px;
            padding-top: 10px
        }

        body {
            display: table;
            margin: 0;
        }
    </style>
</head>
<body style="height:100%">
<div style="height:100%; position: absolute;    width:100%; top: 0px;    bottom: 0;" id="root"></div>
<!--
  This HTML file is a template.
  If you open it directly in the browser, you will see an empty page.

  You can add webfonts, meta tags, or analytics to this file.
  The build step will place the bundled scripts into the <body> tag.

  To begin the development, run `npm start` or `yarn start`.
  To create a production bundle, use `npm run build` or `yarn build`.
-->
</body>
<script type="text/javascript" src="http://localhost:3000//static/js/bundle.js"></script></html>