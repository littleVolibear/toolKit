#!/bin/sh
echo "zkServer stop"
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/zookeeper-3.4.10/bin/zkServer.sh stop"
done
