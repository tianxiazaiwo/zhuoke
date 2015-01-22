#!/usr/bin/expect
set pw pawword
spawn ssh -L 8586:127.0.0.1:8586 -R 8586:127.0.0.1:8587 -N cys_5a005f14@s5.cyssh.com -p 22 -D *:8585
expect 'password: '
send "61ba875e4c\r"
expect eof
