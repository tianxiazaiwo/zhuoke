#!/bin/bash
cd ~/Code/m/shequ
./serv.sh

while (($? != 0)); do
  sleep 1;
  ./serv.sh
done

