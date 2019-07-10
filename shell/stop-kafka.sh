#!/bin/bash
echo "=================	kafka cluster stopping	================="
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/kafka/bin/kafka-server-stop.sh  > /root/logs/kfk_stop.log 2>&1 &"
done
echo "=================       kafka cluster end            ======================="
echo $?
