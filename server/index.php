<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

require_once(__DIR__ . '/autoload.php');

// fix for ie8 xdomain request
// http://stackoverflow.com/questions/12923866/ie-8-xdomainrequest-post-not-working
if (isset($HTTP_RAW_POST_DATA)) {
  $data = explode('&', $HTTP_RAW_POST_DATA);
  foreach ($data as $val) {
    if (!empty($val)) {
      list($key, $value) = explode('=', $val);
      $_REQUEST[$key] = urldecode($value);
    }
  }
}

$jotpoll = new \JotPoll\RequestServer($_REQUEST);
$jotpoll->execute();
?>