#!/bin/sh
echo "===============   zkServer stop   ==========================="
for i in 01 02 03
do
ssh learn$i "source /etc/profile;/opt/module/zookeeper-3.4.10/bin/zkServer.sh stop > /root/logs/stop-zk.log 2>&1;exit"
if [[ $? -eq 0 ]] ; then
echo "stopping zk on learn$i is down"
fi
done
echo "all zk are stopped"
exit 0
