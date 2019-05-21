#!/bin/bash
echo "================     开始启动所有节点服务            ==========="
echo "================     正在启动Zookeeper               ==========="
for i in root@learn01 root@learn02 root@learn03
do
        ssh $i '/opt/module/zookeeper-3.4.10/bin/zkServer.sh start'
done
echo "================     正在启动HDFS                    ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/start-dfs.sh'
echo "================     正在启动YARN                    ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/start-yarn.sh'
echo "================     正在开启JobHistoryServer        ==========="
ssh root@learn01 '/opt/module/hadoop-2.7.2/sbin/mr-jobhistory-daemon.sh start historyserver'
