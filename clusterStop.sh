#!/bin/bash
echo "================     开始停止所有节点服务            ==========="
echo "================     正在停止Zookeeper               ==========="
for i in root@learn01 root@learn02 root@learn03
do
        ssh $i '/opt/module/zookeeper-3.4.10/bin/zkServer.sh stop'
done
echo "================     正在停止HDFS                    ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/stop-dfs.sh'
echo "================     正在停止YARN                    ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/stop-yarn.sh'
echo "================     正在关闭JobHistoryServer        ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/mr-jobhistory-daemon.sh stop historyserver'
