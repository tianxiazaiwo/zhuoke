#!/usr/bin/php
<?php
$port_http = explode(' ', '8201 8202 8203 8204 8205 8206 8207 8208 8209');
$port_live = explode(' ', '35730 35731 35732 35733 35734 35735 35736 35737 35738');

$used_ports = `netstat -nlt|grep ^tcp|awk '{print $4}'`;
$used_ports = explode(PHP_EOL, trim($used_ports));
$used_ports = preg_replace('#^.+?[.:](\d+)$#', '$1', $used_ports);
$used_ports = array_values(array_unique($used_ports));

$port_http = array_diff($port_http, $used_ports);
$port_live = array_diff($port_live, $used_ports);

shuffle($port_http);
shuffle($port_live);

echo "{$port_http[0]} {$port_live[0]}";
