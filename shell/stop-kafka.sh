#!/bin/bash
echo "=================	kafka cluster stopping	================="
APP_NAME=kakfa
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/kafka/bin/kafka-server-stop.sh  > /root/logs/kfk_stop.log 2>&1 &"
if [[ $? -eq 0 ]]; then
echo "stop $APP_NAME on learn$i is down"
fi
done
echo "=================       all kafka stopped            ======================="
exit 0
