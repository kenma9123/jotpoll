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

// detect magic qoutes
if (get_magic_quotes_gpc()) {
  $process = array(&$_REQUEST);
  while (list($key, $val) = each($process)) {
    foreach ($val as $k => $v) {
      unset($process[$key][$k]);
      if (is_array($v)) {
        $process[$key][stripslashes($k)] = $v;
        $process[] = &$process[$key][stripslashes($k)];
      } else {
        $process[$key][stripslashes($k)] = stripslashes($v);
      }
    }
  }
  unset($process);
}

$jotpoll = new \JotPoll\RequestServer($_REQUEST);
$jotpoll->execute();
?>