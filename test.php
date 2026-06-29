<?php
$n='http://222.google.com';
//$arr=preg_replace('~^(https?://)?(:www\.)?([\w-]+)\.([a-zA-Z]{2,6})~','$3.$4',$n);
preg_match('~^(https?://)?(www\.)?([\.\w-]+)\.([a-zA-Z]{2,6})~',$n,$arr);

print_r($arr);
