#群起脚本及相关脚本的编写  
#路径在 /home/atguigu/bin/   因为这个路径拥有用户权限，该用户在任何一个路径下都可以访问、执行

 


#zookeeper群起命令

#!/bin/bash
echo "================     正在启动Zookeeper               ==========="
for i in atguigu@hadoop102 atguigu@hadoop103 atguigu@hadoop104
do
	ssh $i '/opt/module/zookeeper-3.4.10/bin/zkServer.sh start'
done



#集群群起命令

#!/bin/bash
echo "================     开始启动所有节点服务            ==========="
echo "================     正在启动Zookeeper               ==========="
for i in atguigu@hadoop102 atguigu@hadoop103 atguigu@hadoop104
do
	ssh $i '/opt/module/zookeeper-3.4.10/bin/zkServer.sh start'
done
echo "================     正在启动HDFS                    ==========="
ssh atguigu@hadoop102 '/opt/module/hadoop-2.7.2/sbin/start-dfs.sh'
echo "================     正在启动YARN                    ==========="
ssh atguigu@hadoop103 '/opt/module/hadoop-2.7.2/sbin/start-yarn.sh'
echo "================     正在开启JobHistoryServer        ==========="
ssh atguigu@hadoop102 '/opt/module/hadoop-2.7.2/sbin/mr-jobhistory-daemon.sh start historyserver'




#查看三台机器的jps

#!/bin/bash
for i in atguigu@hadoop102 atguigu@hadoop103 atguigu@hadoop104
do
	echo "===========        $i        ==========="
	ssh $i '/opt/module/jdk1.8.0_144/bin/jps'
done


#遇到的问题  
1.编写完之后  chmod +x  filename  给可执行权限
2./bin/bash^M: bad interpreter: 没有那个文件或目录
运行脚本时出现了这样一个错误，打开之后并没有找到所谓的^M，查了之后才知道原来是文件格式的问题，也就是linux和windows之间的不完全兼容。。。
解决方法：
vim filename
然后用命令
:set ff? #可以看到dos或unix的字样. 如果的确是dos格式的。
然后用
:set ff=unix #把它强制为unix格式的, 然后存盘退出。
再次运行脚本。


