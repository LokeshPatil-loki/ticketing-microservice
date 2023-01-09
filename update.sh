#!/usr/bin/bash
declare -a arr=("auth" "orders" "tickets" "nats-test")

for i in ${arr[@]};
do
  cd $i
  echo "Inside " $i
  npm update @loki-ticketing/common
  cd ..
done
