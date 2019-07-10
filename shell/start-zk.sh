#!/bin/bash
echo "===============   zkServer start   ========================"
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/zookeeper-3.4.10/bin/zkServer.sh start >/root/logs/zk-start.log 2>&1;exit"
if [[ $? -eq 0 ]];then
echo "starting kafka on learn$i is down"
fi
done
