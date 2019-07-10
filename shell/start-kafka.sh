#!/bin/bash
echo "=================	kafka cluster starting	================="
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/kafka/bin/kafka-server-start.sh /opt/module/kafka/config/server.properties  > /root/logs/kfk_start.log 2>&1 &"
if [[ $? -eq 0 ]];then
echo "start kafka on learn $i is down"
fi
done
echo "=================   all kafka started   ======================="
exit 0
