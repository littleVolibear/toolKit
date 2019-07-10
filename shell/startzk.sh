#!/bin/sh
echo "zkServer start"
for i in 01 02 03
do
ssh vn$i "source /etc/profile;/root/apps/zookeeper-3.4.5/bin/zkServer.sh start"
done