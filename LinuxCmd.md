谷歌安装器--神器

用hive建立一个数据仓库。用sparkSQL直接操作数据出结果到mysql。你们后台系统直接从mysql中取数据展示

建立job定时跑。写个python脚本每天跟踪错误日志。有问题自动邮件告警

我们之前做数据统计都是Spark做计算处理，布到定时框架里面，然后定时计算写入数据库
================================================

* Web端查看SecondaryNameNode
http://learn02:50090/status.html
* /etc/hosts		修改ip地址和主机名的映射关系
		127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
		::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
		192.168.0.101 server1.itcast.cn
* /etc/sysconfig/network		修改主机名，起个别名
		NETWORKING=yes
		HOSTNAME=server1.itcast.cn
* /etc/udev/rules.d/70-persistent-net.rules   保留一块网卡
* /etc/sysconfig/network-scripts/ifcfg-eth0 修改ip地址
		BOOTPROTO=static
		NAME=eth0
		ONBOOT=yes
		IPADDR=192.168.184.81
		NETMASK=255.255.255.0
		GATEWAY=192.168.184.2
		DNS1=192.168.184.2
		/etc/resolv.conf


*	service iptables stop
	chkconfig iptables on
	chkconfig iptables off


	设置后台服务的自启配置
	chkconfig   查看所有服务器自启配置
	chkconfig iptables off   关掉指定服务的自动启动
	chkconfig iptables on   开启指定服务的自动启动

	chkconfig --list|grep sshd
	chkconfig iptables --list
	chkconfig --level 5 sshd off
	******后台服务管理
	service network status   查看指定服务的状态
	service network stop     停止指定服务
	service network start    启动指定服务
	service network restart  重启指定服务
	service --status-all  查看系统中所有的后台服务


		NETWORKING=yes
		NETWORKING=yes

		HOSTNAME=est01
		GATEWAY=192.168.184.2
		nameserver 192.168.184.2
		service network restart

	shutdown –h now 立该进行关机
	shudown -h 1 "hello, 1 分钟后会关机了"
	shutdown –r now 现在重新启动计算机
	halt 关机，作用和上面一样.
	reboot 现在重新启动计算机
	sync 把内存的数据同步到磁盘

	logout 注销用户
==================================================

sqoop 连接mysql:
sqoop list-databases -connect jdbc:mysql://192.168.184.61:3306 -username root -password root
sqoop 导入到 hive
sqoop import --connect jdbc:mysql://10.51.72.36:3306/shop_member --username root --password xiaomai@@@A --table m_batch --hive-import

转换app/hadoop-2.4.1的root权限为hadoop
	chown hadoop:hadoop -R hadoop-2.4.1/
==========================================new course==========================================================
linux常用命令:
	1、创建/删除文件夹
		在/itcast目录下创建src和WebRoot两个文件夹
		分别创建：mkdir /itcast/src
				  mkdir /itcast/WebRoot
		同时创建：mkdir /itcast/{src,WebRoot}

		mkdir -p aaa/bbb/cc
		rmdir -r aaa/bbb
		rm -rf aaa(强制删)
	3、创建/复制文件
		touch filename
		echo content > filename  (>重定向的作用)
		echo content >> filename (追加文件)
		vi filename

		cp src desc 若名称有改变，是复制并重命名
	5、替换内容
		:%s/content1/content2
	6、查找内容
		:/content   n查找下一个(N上一个)

	7、文件权限的操作
		第一种权限修改方式：
			d：标识节点类型（d：文件夹   -：文件  l:链接）
			r：可读   w：可写    x：可执行 
			第一组rwx：  表示这个文件的拥有者对它的权限：可读可写可执行
			第二组r-x：  表示这个文件的所属组对它的权限：可读，不可写，可执行
			第三组r-x：  表示这个文件的其他用户（相对于上面两类用户）对它的权限：可读，不可写，可执行

			****修改文件权限
			chmod g-rw haha.dat    表示将haha.dat对所属组的rw权限取消
			chmod o-rw haha.dat 	表示将haha.dat对其他人的rw权限取消
			chmod u+x haha.dat      表示将haha.dat对所属用户的权限增加x

		// 第二种给予权限方式:
		****linux文件权限的描述格式解读
		drwxr-xr-x      （也可以用二进制表示  111 101 101  -->  755）
		递归修改文件夹:chmod -R 700 aaa/
		chown angela:angela aaa/    <只有root能执行>   ---改变文件所有组
		一个文件只读，是可以删除的，因为修改只是修改了父目录的东西
		保护文件无法删除，可以让它的父文件夹只读不可写权限
		hdfs dfs -chmod -R 777 
		hdfs dfs -chmod -R 755 /

	8、脚本写法
		#!/bin/bash
		while true
		do
		echo "i love you "
		sleep 1
		done

		secureCRT:-------不断写入文件
			while true
			> do
			> echo 1111 >> acess.log
			> sleep 1
			> done

		#!/bin/bash
		echo "js start"
		ssh shizhan01 "source /etc/profile;xxx.sh start"

	9、用户管理
		*****添加用户
		useradd  angela
		useradd -d directory userName 指定创建用户的根目录
		要修改密码才能登陆 
		passwd angela  按提示输入密码即可
		userdel userName 删除用户
		userdel -r userName 删除用户包括用户的根目录

		**为用户配置sudo权限
		用root编辑 vi /etc/sudoers
		在文件的如下位置，为hadoop添加一行即可
		root    ALL=(ALL)       ALL     
		hadoop  ALL=(ALL)       ALL

		然后，hadoop用户就可以用sudo来执行系统级别的指令
		[hadoop@shizhan ~]$ sudo useradd huangxiaoming

	10、系统管理操作

		mount ****  挂载外部存储设备到文件系统中
		mkdir   /mnt/cdrom      创建一个目录，用来挂载
		mount -t iso9660 -o ro /dev/cdrom /mnt/cdrom/     将设备/dev/cdrom挂载到 挂载点 ：  /mnt/cdrom中

		*****umount
		umount /mnt/cdrom

		开机挂载
		/etc/fstab
		新增:/dev/cdrom /mnt/cdrom iso9660 defaults 0 0



		*****统计文件或文件夹的大小
		du -sh  /mnt/cdrom/Packages    ll -h只是显示文件夹源信息
		df -h    查看磁盘的空间
		****关机
		halt
		****重启
		reboot
二、克隆问题
	解决克隆后eth0不见的问题

	直接修改  /etc/sysconfig/network-script/ifcfg-eth0
	删掉UUID  HWADDR
	DEVICE=eth0
	TYPE=Ethernet
	ONBOOT=yes
	NM_CONTROLLED=yes
	BOOTPROTO=static
	IPADDR=192.168.184.61
	NETMASK=255.255.255.0
	GATEWAY=192.168.184.2

	配置静态地址
	然后：
	rm -rf 　/etc/udev/rules.d/70-persistent-net.rules
	然后 reboot


三、查看文件内容
	*****查看文件内容
	cat    somefile    一次性将文件内容全部输出（控制台）
	more   somefile     可以翻页查看, 下翻一页(空格)    上翻一页（b）   退出（q）
	less   somefile      可以翻页查看,下翻一页(空格)    上翻一页（b），上翻一行(↑)  下翻一行（↓）  可以搜索关键字（/keyword）

	tail -10  install.log   查看文件尾部的10行
	tail -f install.log    小f跟踪文件的唯一inode号，就算文件改名后，还是跟踪原来这个inode表示的文件
	tail -F install.log    大F按照文件名来跟踪

	head -10  install.log   查看文件头部的10行


	******后台服务管理
	service network status   查看指定服务的状态
	service network stop     停止指定服务
	service network start    启动指定服务
	service network restart  重启指定服务
	service --status-all  查看系统中所有的后台服务

	*****系统启动级别管理
	vi  /etc/inittab

	# Default runlevel. The runlevels used are:
	#   0 - halt (Do NOT set initdefault to this)
	#   1 - Single user mode
	#   2 - Multiuser, without NFS (The same as 3, if you do not have networking)
	#   3 - Full multiuser mode
	#   4 - unused
	#   5 - X11
	#   6 - reboot (Do NOT set initdefault to this)
	#
	id:3:initdefault:


	设置后台服务的自启配置
	chkconfig   查看所有服务器自启配置
	chkconfig iptables off   关掉指定服务的自动启动
	chkconfig iptables on   开启指定服务的自动启动
第二天：
	下载:lcd d:/    get file

	打包文件:
		gzip access.log  解压文件：gzip -d access.log.gz
	压缩/解压文件
		tar -cvf myfirsttarball.tar aaa/
		tar -xvf myfirsttarball.tar

	打包压缩文件:	tar -zcvf newFileName dir/
	拆包解压文件:	tar -zxvf xxx.tar.gz


配置   	
	##########安装jdk的过程：
	**解压安装包
	 tar -zxvf jdk-7u45-linux-x64.tar.gz -C apps/
	**然后修改环境变量
	vi /etc/profile
	在文件最后添加
	export JAVA_HOME=/root/apps/jdk1.7.0_45
	export PATH=$PATH:$JAVA_HOME/bin


	export JAVA_HOME=/usr/local/jdk1.7.0_45
	export HADOOP_HOME=/home/hadoop/apps/hadoop-2.6.4
	export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
	保存退出

	**然后重新加载环境变量
	source /etc/profile


	ln -s  /mnt/cdrom ./centos      //创建软连接指向/mnt/cdrom

	// 追加文件
	cat >> file1 << EOF
	CONTENT
	EOF

四、yum

// 安装ssh  ssh-copy-id
yum -y install openssh-clients 
安装httpd并确认安装
yum instll -y httpd

列出所有可用的package和package组
yum list

清除所有缓冲数据
yum clean all

列出一个包所有依赖的包
yum deplist httpd

删除httpd
yum remove httpd

3.制作本地YUM源
3.1.为什么要制作本地YUM源
YUM源虽然可以简化我们在Linux上安装软件的过程，但是生成环境通常无法上网，不能连接外网的YUM源，说以接就无法使用yum命令安装软件了。为了在内网中也可以使用yum安装相关的软件，就要配置yum源。
3.2.YUM源的原理
YUM源其实就是一个保存了多个RPM包的服务器，可以通过http的方式来检索、下载并安装相关的RPM包

3.3.制作本地YUM源
1.准备一台Linux服务器，用最简单的版本CentOS-6.7-x86_64-minimal.iso
2.配置好这台服务器的IP地址
3.上传CentOS-6.7-x86_64-bin-DVD1.iso到服务器
4.将CentOS-6.7-x86_64-bin-DVD1.iso镜像挂载到某个目录
mkdir /var/iso
mount -o loop CentOS-6.7-x86_64-bin-DVD1.iso /var/iso
5.修改本机上的YUM源配置文件，将源指向自己
备份原有的YUM源的配置文件
cd /etc/yum.repos.d/
rename .repo .repo.bak *
vi CentOS-Local.repo
[base]
name=CentOS-Local
baseurl=file:///var/iso
gpgcheck=1
enabled=1   #很重要，1才启用
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
添加上面内容保存退出
6.清除YUM缓冲
yum clean all
7.列出可用的YUM源
yum repolist
8.安装相应的软件
yum install -y httpd
9.开启httpd使用浏览器访问http://192.168.0.100:80（如果访问不通，检查防火墙是否开启了80端口或关闭防火墙）
service httpd start
10.将YUM源配置到httpd（Apache Server）中，其他的服务器即可通过网络访问这个内网中的YUM源了
cp -r /var/iso/ /var/www/html/CentOS-6.7
11.取消先前挂载的镜像
umount /var/iso
12.在浏览器中访问http://192.168.0.100/CentOS-6.7/

13.让其他需要安装RPM包的服务器指向这个YUM源，准备一台新的服务器，备份或删除原有的YUM源配置文件
cd /etc/yum.repos.d/
rename .repo .repo.bak *
vi CentOS-Local.repo
[base]
name=CentOS-Local
baseurl=http://192.168.0.100/CentOS-6.7
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
添加上面内容保存退出
14.在这台新的服务器上执行YUM的命令
yum clean all
yum repolist
15.安装相应的软件
yum install -y gcc


16、加入依赖包到私有yum的repository
进入到repo目录
执行命令：  createrepo  .

安装mysql
rpm -ivh MySQL-client-5.5.48-1.linux2.6.x86_64.rpm
rpm -ivh MySQL-server-5.5.48-1.linux2.6.x86_64.rpm
%%安装perl依赖
rpm -ivh perl*
《可能会提示有包冲突，解决： rpm -e 冲突包名 --nodeps 》
修改用户密码： /usr/bin/mysql_secure_installation
mysql -uroot -proot
// scp命令安装
yum install scp
===================================xxxxxxxxxxxxxxxxxxxxxxxxxxxxx==============================
解决克隆后eth0不见的问题

直接修改  /etc/sysconfig/network-script/ifcfg-eth0
删掉UUID  HWADDR
配置静态地址
然后：
rm -rf 　/etc/udev/rules.d/70-persistent-net.rules
然后 reboot


时间同步:
sudo date -s "2019-05-22 12:54:00"

scp下载文件 
	cd /home/hadoop/apps/hadoop-2.6.4/etc/hadoop
	lcd d:/
	get file1 file2 ....    

ll | more  翻页显示
ll | grep xx 搜搜结果查找xx

vn01	namenode zkfc
vn02	namenode zkfc
vn03	resourcemanager
vn04	resourcemanager
vn05	nodemanger datanode zookeeper journalnode
vn06	nodemanger datanode zookeeper journalnode
vn06	nodemanger datanode zookeeper journalnode
----------------------------------------------------------------------------------



五、hive

==================================================================================

(a) install mysql
mysql -uroot -proot		--远程授权
#(执行下面的语句  *.*:所有库下的所有表   %：任何IP地址或主机都可以连接)
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
FLUSH PRIVILEGES;
==================================================================================

(b)配置元数据库信息conf   vi  hive-site.xml 
	添加如下内容：
	<configuration>
	<property>
	<name>javax.jdo.option.ConnectionURL</name>
	<value>jdbc:mysql://localhost:3306/hive?createDatabaseIfNotExist=true</value>
	<description>JDBC connect string for a JDBC metastore</description>
	</property>

	<property>
	<name>javax.jdo.option.ConnectionDriverName</name>
	<value>com.mysql.jdbc.Driver</value>
	<description>Driver class name for a JDBC metastore</description>
	</property>

	<property>
	<name>javax.jdo.option.ConnectionUserName</name>
	<value>root</value>
	<description>username to use against metastore database</description>
	</property>

	<property>
	<name>javax.jdo.option.ConnectionPassword</name>
	<value>root</value>
	<description>password to use against metastore database</description>
	</property>
	</configuration>
(c)bin/hive出错
	cp  ~/soft/mysql-connector-java-5.1.28.jar		~/apps/hive/lib/	--复制驱动包
	rm  apps/hadoop-2.6.4/share/hadoop/yarn/lib/jline-0.9.94.jar   		--删除hadoop低版本
	cp  apps/hive/lib/jline-2.12.jar apps/hadoop-2.6.4/share/hadoop/yarn/lib/--加入高版本jar
(d)bin/hiveserver2(服务端)
	beeline(客户端) !connect jdbc:hive2://localhost:10000	root 无密码
---------------------------------------------------------------------------------------------

(e)create table

---------------------------------------------------------------------------------------------
|内部表：
|	create table t_sz(id int,name string)
|	row format delimited
|	fields terminated by ',';
---------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------
|外部表：
|	create external table t_extra(id int,name string)
|	row format delimited
|	fields terminated by '\t'
|	stored as textfile 
|	location '/des';
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
|查看表：
|desc table_name;
|desc extended table_name(bin/hive)	
|desc formatted table_name(客户端)
---------------------------------------------------------------------------------------------


(f)导入数据

---------------------------------------------------------------------------------------------
load data local inpath '/root/sz.dat' into(overwrite) table t_sz;
hive客户端可以查看数据
dfs -cat /des/extra.dat;
---------------------------------------------------------------------------------------------
(g)分区
---------------------------------------------------------------------------------------------
|创建表：
|		create table part(id int,name string)
|		partitioned by (country string)
|		row format delimited
|		fields terminated by ','
|
|加载：
|		load data local inpath '/root/part.dat' into table part partition(country='cn');
|		load data local inpath '/root/japan.dat' into table part partition(country='jp');
|增加分区：
|		alter table part add partition(country='us');
|		alter table part drop partition(country='us');
|
---------------------------------------------------------------------------------------------
(h)分桶
---------------------------------------------------------------------------------------------
|-----创建分桶表
|create table bucket(id int,name string)
|clustered by (id)
|sorted by (id)
|into 4 buckets
|row format delimited
|fields terminated by ',';
|
|
|#设置变量,设置分桶为true, 设置reduce数量是分桶的数量个数
|set hive.enforce.bucketing = true;
|set mapreduce.job.reduces=4;
|
|1、order by 会对输入做全局排序，因此只有一个reducer，会导致当输入规模较大时，需要较长的计算时间。
|2、sort by不是全局排序，其在数据进入reducer前完成排序。因此，如果用sort |by进行排序，并且设置mapred.reduce.tasks>1，则sort by只保证每个reducer的输出有序，不保证全局有序。
|3、distribute by根据distribute by指定的内容将数据分到同一个reducer。
|4、Cluster by 除了具有Distribute by的功能外，还会对该字段进行排序。因此，常常认为cluster by = |distribute by + sort by
|
|保存select查询结果的几种方式：
|1、将查询结果保存到一张新的hive表中
|create table t_tmp
|as
|select * from t_p;

|2、将查询结果保存到一张已经存在的hive表中
|insert into  table t_tmp
|select * from t_p;

|3、将查询结果保存到指定的文件目录（可以是本地，也可以是hdfs）
|insert overwrite local directory '/home/hadoop/test'
|select * from t_p;
---------------------------------------------------------------------------------------------
(i)自定义函数
public class CopyOfToLowerCase extends UDF {

	// 必须是public
	public String evaluate(String field) {
		String result = field.toLowerCase();
		return result;
	}
}

2、打成jar包上传到服务器
3、将jar包添加到hive的classpath
hive>add JAR /root/aa.jar;
4、创建临时函数与开发好的java class关联
Hive>create temporary function tolow as 'cn.itcast.bigdata.udf.CopyOfToLowerCase';
5、select id,tolow(name) from t_sz01;

startbeeline.sh
#!/bin/bash
/root/apps/hive/bin/beeline -u jdbc:hive2://we01:10000 -n root
--原始数据
create table t_json(line string)
row format delimited
---切割数据
create table t_rating as
select split(parsejson(line),'\t')[0]as movieid,split(parsejson(line),'\t')[1] as rate,split(parsejson(line),'\t')[2] as timestring,split(parsejson(line),'\t')[3] as uid from t_json;
----内置json
select get_json_object(line,'$.movie') as moive,get_json_object(line,'$.rate') as rate  from t_json limit 10;


---transform
先编辑一个python脚本文件
########python######代码
vi weekday_mapper.py
#!/bin/python
import sys
import datetime

for line in sys.stdin:
  line = line.strip()
  movieid, rating, unixtime,userid = line.split('\t')
  weekday = datetime.datetime.fromtimestamp(float(unixtime)).isoweekday()
  print '\t'.join([movieid, rating, str(weekday),userid])


create TABLE u_data_new as
SELECT
  TRANSFORM (movieid , rate, timestring,uid)
  USING 'python weekday_mapper.py'
  AS (movieid, rating, weekday,userid)
FROM t_rating;

六、flume
从网络端口接收数据，下沉到logger

采集配置文件，netcat-logger.conf
# example.conf: A single-node Flume configuration

# Name the components on this agent
#给那三个组件取个名字
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
#类型, 从网络端口接收数据,在本机启动, 所以localhost, type=spoolDir采集目录源,目录里有就采
a1.sources.r1.type = netcat
a1.sources.r1.bind = localhost
a1.sources.r1.port = 44444

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
#下沉的时候是一批一批的, 下沉的时候是一个个eventChannel参数解释：
#capacity：默认该通道中最大的可以存储的event数量
#trasactionCapacity：每次最大可以从source中拿到或者送到sink中的event数量
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1

启动命令：
#告诉flum启动一个agent,指定配置参数, --name:agent的名字,
$ bin/flume-ng agent --conf conf --conf-file conf/netcat-logger.conf --name a1 -Dflume.root.logger=INFO,console

传入数据：
$ telnet localhost 44444
Trying 127.0.0.1...
Connected to localhost.localdomain (127.0.0.1).
Escape character is '^]'.
Hello world! <ENTER>
OK


监视文件夹
启动命令：  
bin/flume-ng agent -c ./conf -f ./conf/spool-logger.conf -n a1 -Dflume.root.logger=INFO,console

测试： 往/home/hadoop/flumeSpool放文件（mv ././xxxFile /home/hadoop/flumeSpool），但是不要在里面生成文件

# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
#监听目录,spoolDir指定目录, fileHeader要不要给文件夹前坠名
a1.sources.r1.type = spooldir
a1.sources.r1.spoolDir = /home/hadoop/flumespool
a1.sources.r1.fileHeader = true

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
----------------------------------------------------------------------------------------
案例3
tail-hdfs.conf

用tail命令获取数据，下沉到hdfs


mkdir /root/log

while true
do
echo 111111 >> /root/log/test.log
sleep 0.5
done

tail -F test.log

采集到hdfs中, 文件中的目录不用自己建的

检查下hdfs式否是salf模式:
	hdfs dfsadmin -report

bin/flume-ng agent -c conf -f conf/tail-hdfs.conf -n a1

前端页面查看下, master:50070, 文件目录: /flum/events/16-04-20/


启动命令：
bin/flume-ng agent -c conf -f conf/tail-hdfs.conf -n a1
################################################################

# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

#exec 指的是命令
# Describe/configure the source
a1.sources.r1.type = exec
#F根据文件名追中, f根据文件的nodeid追中
a1.sources.r1.command = tail -F /root/log/test.log
a1.sources.r1.channels = c1

# Describe the sink
#下沉目标
a1.sinks.k1.type = hdfs
a1.sinks.k1.channel = c1
#指定目录, flume帮做目的替换
a1.sinks.k1.hdfs.path = /flume/events/%y-%m-%d/%H%M/
#文件的命名, 前缀
a1.sinks.k1.hdfs.filePrefix = events-

#10 分钟就改目录
a1.sinks.k1.hdfs.round = true
a1.sinks.k1.hdfs.roundValue = 10
a1.sinks.k1.hdfs.roundUnit = minute

#文件滚动之前的等待时间(秒)
a1.sinks.k1.hdfs.rollInterval = 3

#文件滚动的大小限制(bytes)
a1.sinks.k1.hdfs.rollSize = 500

#写入多少个event数据后滚动文件(事件个数)
a1.sinks.k1.hdfs.rollCount = 20

#5个事件就往里面写入
a1.sinks.k1.hdfs.batchSize = 5

#用本地时间格式化目录
a1.sinks.k1.hdfs.useLocalTimeStamp = true

#下沉后, 生成的文件类型，默认是Sequencefile，可用DataStream，则为普通文本
a1.sinks.k1.hdfs.fileType = DataStream

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
-----------------------------------------------------------------------------
案例4
两个age连接
tail-avro.log
# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
a1.sources.r1.type = exec
a1.sources.r1.command = tail -F /home/hadoop/log/test.log
a1.sources.r1.channels = c1

# Describe the sink
#绑定的不是本机, 是另外一台机器的服务地址, sink端的avro是一个发送端, avro的客户端, 往hadoop01这个机器上发
a1.sinks = k1
a1.sinks.k1.type = avro
a1.sinks.k1.channel = c1
a1.sinks.k1.hostname = master
a1.sinks.k1.port = 4141
a1.sinks.k1.batch-size = 2

-------------------------------
# Name the components on this agent
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# Describe/configure the source
#source中的avro组件是接收者服务, 绑定本机
a1.sources.r1.type = avro
a1.sources.r1.channels = c1
a1.sources.r1.bind = 0.0.0.0
a1.sources.r1.port = 4141

# Describe the sink
a1.sinks.k1.type = logger

# Use a channel which buffers events in memory
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# Bind the source and sink to the channel
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1


bin/flume-ng agent -c conf -f conf/avro-hdfs.conf -n a1 -Dflume.root.logger=INFO,console
bin/flume-ng agent -c conf -f conf/avro-logger.conf -n a1 
========================================================================================
七、azkaban
	azkaban-executor-server-2.5.0.tar.gz
	azkaban-sql-script-2.5.0.tar.gz
	azkaban-web-server-2.5.0.tar.gz

	mysql：source  /root/apps/azkaban-2.5.0/create-all-sql-2.5.0.sql;
	创建ssl配置
	keytool -keystore keystore -alias jetty -genkey -keyalg RSA
	不断回车即可
	cp keystore server/
	注：先配置好服务器节点上的时区
	1、先生成时区配置文件Asia/Shanghai，用交互式命令 tzselect 即可
	2、拷贝该时区文件，覆盖系统本地时区配置
	cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime


	统一时间：sudo date -s '2017-09-25 17:33:00'
	hwclock -w
	1.1
	vi azkaban.properties(server-conf)
		default.timezone.id=Asia/Shanghai
		mysql.user=root
		mysql.password=root
		jetty.password=123456
		jetty.keypassword=123456
		jetty.trustpassword=123456
	1.2(server-conf)
	 	vi azkaban-users.xml
	 	<user username="admin" password="admin" roles="admin,metrics" /> 
	2.1启动
		在azkaban web服务器目录下执行启动命令
		bin/azkaban-web-start.sh
		注:在web服务器根目录运行
		或者启动到后台
		nohup  bin/azkaban-web-start.sh  1>/tmp/azstd.out  2>/tmp/azerr.out &

		bin/azkaban-executor-start.sh
	2.2案例1--init
		#command.job
		type=command
		command=echo xxoo
		上传jar包
	案列2--two
		# foo.job
		type=command
		command=echo foo

		# bar.job
		type=command
		dependencies=foo
		command=echo bar
	案例3--mkdir
		# fs.job
		type=command
		command=/root/apps/hadoop-2.6.4/bin/hadoop fs -mkdir /azaz
	案例4--mr
		# mrwc.job
		type=command
		command=/home/hadoop/apps/hadoop-2.6.4/bin/hadoop  jar hadoop-mapreduce-examples-2.6.1.jar wordcount /wordcount/inpuazoutt /wordcount/
	案例5--hive
		# hive.job
		type=command
		command=/root/apps/hive/bin/hive -e 'show tables'
	案列6--hive2
		# hivef.job
		type=command
		command=/root/apps/hive/bin/hive -f 'test.sql'

		use default;
		drop table aztest;
		create table aztest(id int,name string) row format delimited fields terminated by ',';
		load data inpath '/hiveinput' into table aztest;
		create table azres as select * from aztest;
		insert overwrite directory '/aztest/hiveoutput' select count(1) from aztest; 
八、sqoop
	1.1配置文件
	$ cd $SQOOP_HOME/conf
	$ mv sqoop-env-template.sh sqoop-env.sh
	打开sqoop-env.sh并编辑下面几行：
	export HADOOP_COMMON_HOME=/home/hadoop/apps/hadoop-2.6.1/ 
	export HADOOP_MAPRED_HOME=/home/hadoop/apps/hadoop-2.6.1/
	export HIVE_HOME=/home/hadoop/apps/hive-1.2.1
	1.2拷贝jar
		cp ~/apps/hive/lib/mysql-connector-java-5.1.28.jar ./
	1.3开始导入---导入到hdfs
		bin/sqoop import \
		--connect jdbc:mysql://we01:3306/azkaban \
		--username root \
		--password root \
		--table t_stu --m 1
		1.3.1导入位置
			/user/root/t_stu/part-m-00000
		1.3.2导入到hdfs指定位置
			bin/sqoop import \
			--connect jdbc:mysql://we01:3306/azkaban \
			--username root \
			--password root \
			--target-dir /table \
			--table t_stu --m 1

	1.4导入到hive
			bin/sqoop import --connect jdbc:mysql://we01:3306/azkaban --username root --password root --table t_stu --hive-import --m 1
		1.4.1默认导出位置
			/user/hive/warehouse/t_stu/part-m-00000

	1.5条件选择导入到hdfs
			bin/sqoop import \
			--connect jdbc:mysql://we01:3306/azkaban \
			--username root \
			--password root \
			--where "id ='2'" \
			--target-dir /wherequery \
			--table t_stu --m 1
	1.6自定义sql
			bin/sqoop import \
			--connect jdbc:mysql://we01:3306/azkaban \
			--username root \
			--password root \
			--target-dir /wherequery2 \
			--query 'select id,name from t_stu WHERE  id>1 and $CONDITIONS' \
			--split-by id \
			--fields-terminated-by '\t' \
			--m 1
	--fields-terminated-by '\t' \   (结果以\t 分隔)
	1.7增量导入
			bin/sqoop import \
			--connect jdbc:mysql://we01:3306/azkaban \
			--username root \
			--password root \
			--table t_stu --m 1 \
			--incremental append \
			--check-column id \
			--last-value 4

		1.7.1导入位置：
			/user/root/t_stu

	1.8导出
		CREATE TABLE employee ( 
		   id INT NOT NULL PRIMARY KEY, 
		   name VARCHAR(20), 
		   deg VARCHAR(20),
		   salary INT,
		   dept VARCHAR(10));

		 1201,gopal,manager,50000,TP
		 1202,manisha,preader,50000,TP
		 1203,kalil,phpdev,30000,AC
		 1204,prasanth,phpdev,30000,AC
		 1205,kranthi,admin,20000,TP
		 1206,satishp,grpdes,20000,GR
		导入到mysql
		bin/sqoop export \
		--connect jdbc:mysql://we01:3306/test \
		--username root \
		--password root \
		--table employee \
		--export-dir /input
=============================================================================
九、hbase

!tables
!describe "ORDER_INFO"

fedaration搭建
========================================================================
|7台电脑
|
|1、namenode ZKFC ResourceManager
|2、namenode QuorumPeerMain journalnode、ZKFC
|3、namenode QuorumPeerMain journalnode、ZKFC、ResourceManager
|4、namenode QuorumPeerMain journalnode、ZKFC
|5、6、7 datanode nodemanager
|
|1、启动zookeeper(we02、we03、we04)
|	startzk.sh
|2、启动journalnode(we02、we03、we04)
|	hadoop-daemon.sh start journalnode
|3、格式化hadoop
|   在bi下nn1上  
|	hdfs namenode -format –clusterID imm
|	hdfs zkfc -formatZK
|	拷贝元数据目录到standby(nn2)
|
|	在dt下nn3上  
|	hdfs namenode -format –clusterID imm   ###clusterID必须与bi的相同
|	hdfs zkfc -formatZK
|	拷贝元数据目录到standby(nn4)
|4、start-dfs.sh start-yarn.sh 启动ZKFC命令：sbin/hadoop-daemons.sh start zkfc 
========================================================================

1.安装配置zooekeeper集群（在we03/we04/we05上）
		1.1解压
			tar -zxvf zookeeper-3.4.5.tar.gz -C /root/apps/
		1.2修改配置
			cd /root/apps/zookeeper-3.4.5/conf/
			cp zoo_sample.cfg zoo.cfg
			vim zoo.cfg
			修改：dataDir=/root/apps/zookeeper-3.4.5/tmp
			在最后添加：
			server.1=we02:2888:3888
			server.2=we03:2888:3888
			server.3=we04:2888:3888
			保存退出
			然后创建一个tmp文件夹
			mkdir /root/apps/zookeeper-3.4.5/tmp
			echo 1 > /root/apps/zookeeper-3.4.5/tmp/myid

		1.3将配置好的zookeeper拷贝到其他节点(首先分别在we02、we03根目录下创建一个hadoop目录：mkdir /hadoop)
			scp -r /root/apps/zookeeper-3.4.5/ we03:$PWD
			scp -r /root/apps/zookeeper-3.4.5/ we04:$PWD
			
			注意：修改we03、we04对应/we/zookeeper-3.4.5/tmp/myid内容
			we03：
				echo 2 > /root/apps/zookeeper-3.4.5/tmp/myid
			we04：
				echo 3 > /root/apps/zookeeper-3.4.5/tmp/myid
2.安装配置hadoop集群（在hadoop00上操作）
	2.1解压
		tar -zxvf hadoop-2.6.4.tar.gz -C /root/apps/
	2.2配置HDFS（hadoop2.0所有的配置文件都在$HADOOP_HOME/etc/hadoop目录下）
	#将hadoop添加到环境变量中
		vim /etc/profile
		export JAVA_HOME=/usr/java/jdk1.7.0_55
		export HADOOP_HOME=/hadoop/hadoop-2.6.4
		export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin

	#hadoop2.0的配置文件全部在$HADOOP_HOME/etc/hadoop下
	cd /root/apps/hadoop-2.6.4/etc/hadoop

	2.2.1修改hadoop-env.sh
		export JAVA_HOME=/root/apps/jdk1.7.0_55	
	2.2.2修改core-site.xml
		<!-- Put site-specific property overrides in this file. -->
		<configuration>

		<property>
		<name>fs.defaultFS</name>
		<value>viewfs:///</value>
		</property>

		<property>
		<name>fs.viewfs.mounttable.default.link./bi</name>
		<value>hdfs://bi/</value>
		</property>

		<property>
		<name>fs.viewfs.mounttable.default.link./dt</name>
		<value>hdfs://dt/</value>
		</property>

		<!-- 指定hadoop临时目录 -->
		<property>
		<name>hadoop.tmp.dir</name>
		<value>/root/hdpdata/</value>
		</property>

		<!-- 指定zookeeper地址 -->
		<property>
		<name>ha.zookeeper.quorum</name>
		<value>we02:2181,we03:2181,we04:2181</value>
		</property>
		</configuration>
	2.2.2修改hdfs-site.xml(we01、we02)
		<!-- Put site-specific property overrides in this file. -->

		<configuration>
		<!--指定hdfs的nameservice为bi，需要和core-site.xml中的保持一致 -->
		<property>
		<name>dfs.nameservices</name>
		<value>bi,dt</value>
		</property>
		<!-- bi下面有两个NameNode，分别是nn1，nn2 -->
		<property>
		<name>dfs.ha.namenodes.bi</name>
		<value>nn1,nn2</value>
		</property>

		<property>
		<name>dfs.ha.namenodes.dt</name>
		<value>nn3,nn4</value>
		</property>

		<!-- bi的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.bi.nn1</name>
		<value>we01:9000</value>
		</property>
		<!-- nn1的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.bi.nn1</name>
		<value>we01:50070</value>
		</property>
		<!-- nn2的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.bi.nn2</name>
		<value>we02:9000</value>
		</property>
		<!-- nn2的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.bi.nn2</name>
		<value>we02:50070</value>
		</property>

		<!-- dt的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.dt.nn3</name>
		<value>we03:9000</value>
		</property>
		<!-- nn1的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.dt.nn3</name>
		<value>we03:50070</value>
		</property>
		<!-- nn2的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.dt.nn4</name>
		<value>we04:9000</value>
		</property>
		<!-- nn2的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.dt.nn4</name>
		<value>we04:50070</value>
		</property>


		<!-- 指定NameNode的edits元数据在JournalNode上的存放位置 -->
		<!--一下property项的配置，不能都配 -->

		<!--  在bi名称空间的两个namenode中用如下配置  -->
		<property>
		<name>dfs.namenode.shared.edits.dir</name>
		<value>qjournal://we02:8485;we03:8485;we04:8485/bi</value>
		</property>


		<!-- 指定JournalNode在本地磁盘存放数据的位置 -->
		<property>
		<name>dfs.journalnode.edits.dir</name>
		<value>/root/hdpdata/journaldata</value>
		</property>
		<!-- 开启NameNode失败自动切换 -->
		<property>
		<name>dfs.ha.automatic-failover.enabled</name>
		<value>true</value>
		</property>


		<!-- 配置失败自动切换实现方式 -->
		<property>
		<name>dfs.client.failover.proxy.provider.bi</name>
		<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
		</property>

		<property>
		<name>dfs.client.failover.proxy.provider.dt</name>
		<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
		</property>

		<!-- 配置隔离机制方法，多个机制用换行分割，即每个机制暂用一行-->
		<property>
		<name>dfs.ha.fencing.methods</name>
		<value>
		sshfence
		shell(/bin/true)
		</value>
		</property>
		<!-- 使用sshfence隔离机制时需要ssh免登陆 -->
		<property>
		<name>dfs.ha.fencing.ssh.private-key-files</name>
		<value>/root/.ssh/id_rsa</value>
		</property>
		<!-- 配置sshfence隔离机制超时时间 -->
		<property>
		<name>dfs.ha.fencing.ssh.connect-timeout</name>
		<value>30000</value>
		</property>
		</configuration>

		修改hdfs-site.xml(we03、we04)
		<!-- Put site-specific property overrides in this file. -->

		<configuration>
		<!--指定hdfs的nameservice为bi，需要和core-site.xml中的保持一致 -->
		<property>
		<name>dfs.nameservices</name>
		<value>bi,dt</value>
		</property>
		<!-- bi下面有两个NameNode，分别是nn1，nn2 -->
		<property>
		<name>dfs.ha.namenodes.bi</name>
		<value>nn1,nn2</value>
		</property>

		<property>
		<name>dfs.ha.namenodes.dt</name>
		<value>nn3,nn4</value>
		</property>

		<!-- bi的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.bi.nn1</name>
		<value>we01:9000</value>
		</property>
		<!-- nn1的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.bi.nn1</name>
		<value>we01:50070</value>
		</property>
		<!-- nn2的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.bi.nn2</name>
		<value>we02:9000</value>
		</property>
		<!-- nn2的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.bi.nn2</name>
		<value>we02:50070</value>
		</property>

		<!-- dt的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.dt.nn3</name>
		<value>we03:9000</value>
		</property>
		<!-- nn1的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.dt.nn3</name>
		<value>we03:50070</value>
		</property>
		<!-- nn2的RPC通信地址 -->
		<property>
		<name>dfs.namenode.rpc-address.dt.nn4</name>
		<value>we04:9000</value>
		</property>
		<!-- nn2的http通信地址 -->
		<property>
		<name>dfs.namenode.http-address.dt.nn4</name>
		<value>we04:50070</value>
		</property>


		<!-- 指定NameNode的edits元数据在JournalNode上的存放位置 -->
		<!--一下property项的配置，不能都配 -->

		<!--  在dt名称空间的两个namenode中，用如下配置-->
		<property>
		<name>dfs.namenode.shared.edits.dir</name>
		<value>qjournal://we02:8485;we03:8485;we04:8485/dt</value>
		</property>


		<!-- 指定JournalNode在本地磁盘存放数据的位置 -->
		<property>
		<name>dfs.journalnode.edits.dir</name>
		<value>/root/hdpdata/journaldata</value>
		</property>
		<!-- 开启NameNode失败自动切换 -->
		<property>
		<name>dfs.ha.automatic-failover.enabled</name>
		<value>true</value>
		</property>


		<!-- 配置失败自动切换实现方式 -->
		<property>
		<name>dfs.client.failover.proxy.provider.bi</name>
		<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
		</property>

		<property>
		<name>dfs.client.failover.proxy.provider.dt</name>
		<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
		</property>

		<!-- 配置隔离机制方法，多个机制用换行分割，即每个机制暂用一行-->
		<property>
		<name>dfs.ha.fencing.methods</name>
		<value>
		sshfence
		shell(/bin/true)
		</value>
		</property>
		<!-- 使用sshfence隔离机制时需要ssh免登陆 -->
		<property>
		<name>dfs.ha.fencing.ssh.private-key-files</name>
		<value>/root/.ssh/id_rsa</value>
		</property>
		<!-- 配置sshfence隔离机制超时时间 -->
		<property>
		<name>dfs.ha.fencing.ssh.connect-timeout</name>
		<value>30000</value>
		</property>
		</configuration>
	2.2.3修改mapred-site.xml
	<configuration>
	<!-- 指定mr框架为yarn方式 -->
	<property>
	<name>mapreduce.framework.name</name>
	<value>yarn</value>
	</property>
	</configuration>
	2.2.4修改yarn-site.xml
	<configuration>

	<!-- Site specific YARN configuration properties -->
	<!-- 开启RM高可用 -->
	<property>
	<name>yarn.resourcemanager.ha.enabled</name>
	<value>true</value>
	</property>
	<!-- 指定RM的cluster id -->
	<property>
	<name>yarn.resourcemanager.cluster-id</name>
	<value>yrc</value>
	</property>
	<!-- 指定RM的名字 -->
	<property>
	<name>yarn.resourcemanager.ha.rm-ids</name>
	<value>rm1,rm2</value>
	</property>
	<!-- 分别指定RM的地址 -->
	<property>
	<name>yarn.resourcemanager.hostname.rm1</name>
	<value>we01</value>
	</property>
	<property>
	<name>yarn.resourcemanager.hostname.rm2</name>
	<value>we03</value>
	</property>
	<!-- 指定zk集群地址 -->
	<property>
	<name>yarn.resourcemanager.zk-address</name>
	<value>we02:2181,we03:2181,we04:2181</value>
	</property>
	<property>
	<name>yarn.nodemanager.aux-services</name>
	<value>mapreduce_shuffle</value>
	</property>
	</configuration>
	2.2.5修改slaves(slaves是指定子节点的位置，因为要在we01上启动HDFS、在we01启动yarn，所以we01上的slaves文件指定的是datanode的位置，we01上的slaves文件指定的是nodemanager的位置)
	we05
	we06
	we07
	2.2.6配置免密码登陆
	we01---01 02 03 04 05 06 07
	we02---01 02 03 04 05 06 07
	we03---01 02 03 04 05 06 07
	we04---01 02 03 04 05 06 07
	2.3
		将配置好的hadoop拷贝到其他节点

	2.4开始启动
	=============================================================
	2.5启动zookeeper集群（分别在we02、we03、we04上启动zk）
		cd /hadoop/zookeeper-3.4.5/bin/
		./zkServer.sh start
		#查看状态：一个leader，两个follower
		./zkServer.sh status
		或者用脚本启动startzk.sh
	=============================================================

	2.6启动journalnode（分别在在we02、we03、we04上执行）
		cd /hadoop/hadoop-2.6.4
		sbin/hadoop-daemon.sh start journalnode
		#运行jps命令检验，we02、we03、we04上多了JournalNode进程
	=============================================================

	=============================================================

	2.7格式化HDFS(手敲，不然容易出毛病)
		在bi下nn1上  
		hdfs namenode -format –clusterID itcast  (CID-2577fdbf-ab72-4c85-a784-69688196cb16)
		hdfs zkfc -formatZK
		拷贝元数据目录到standby(nn2)

		在dt下nn3上  
		hdfs namenode -format –clusterID itcast   ###clusterID必须与bi的相同
		hdfs zkfc -formatZK
		拷贝元数据目录到standby(nn4)
	=============================================================

	2.8启动HDFS(we01)
	=============================================================
		start-dfs.sh
	=============================================================


	2.9启动yarn
	=============================================================
		start-yarn.sh
	=============================================================



解压：hbase-0.99.2-bin.tar.gz
	vi /etc/profile
	export HBASE_HOME=/root/apps/hbase
	export PATH=$PATH:HBASE_HOME/bin

	3.1 modify hbase_env.sh
		export JAVA_HOME=/usr/local/jdk1.7.0_45
		export JAVA_CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
		export HBASE_OPTS="-XX:+UseConcMarkSweepGC"
		export HBASE_MANAGES_ZK=false
	3.2 modify regionservers 
			we05
			we06
			we07
	3.3 modify hbase-site.xml
		<configuration>
		<property>
		<name>hbase.master</name>
		<value>we01:60000</value>
		</property>
		<property>
		<name>hbase.master.maxclockskew</name> 
		<value>180000</value>
		</property>
		<property>
		<name>hbase.rootdir</name>
		<value>hdfs://bi/hbase</value>
		</property>
		<property>
		<name>hbase.cluster.distributed</name> 
		<value>true</value>
		</property>
		<property>
		<name>hbase.zookeeper.quorum</name>
		<value>we02,we03,we04</value>
		</property>
		<property>
		<name>hbase.zookeeper.property.dataDir</name>
		<value>/root/hbase/tmp/zookeeper</value>
		</property>
		</configuration>
	3.4 core-site.xml hdfs-site.xml加到conf下

	3.5 启动命令：bin/start-hbase.sh

	3.6 启动多个主节点(slaves机器上 比如we05)
		local-master-backup.sh start 2
		启动一个从节点
		hbase-daemon.sh start regionserver
	3.7操作命令: hbase shell
		list
		create 'user','info1','info2'
		exists 'user'
		describe 'user'
		删除表
			disable 'user'
			en_abled 'user'
			drop 'user'
		插入记录
			put 'user','1234','info1:name','zhangsan'
			scan 'user'
		查询记录
			get 'user','1234'	查询rowkey下的所有数据
			count 'user'	查询表中的记录总数
			get 'user','1234','info1'	查询某个列族
			get 'user','1234','info1:name'	查询某个列族的某个列
		删除某行
			delete 'user','1234','info2:name'
hbase 应用场景：
	交易历史记录查询系统
	百亿行数据表，千亿级二级索引表
	每天千万行更新
	查询场景简单，检索条件较少
	关系型数据库所带来的问题
	基于userId+time+id rowkey设计
	成本考虑

write hbase
    rdd.saveAsNewAPIHadoopDataset(job.getConfiguration())  
read hbase
	val stuRDD = sc.newAPIHadoopRDD(conf, classOf[TableInputFormat]
十、storm

worker === jvm === 端口号 === slots === Num executors  3
Executors ==== Tasks === Num workers === Num Tasks  28

Id		Topology	Executors	Tasks
spout	wordcount	5			5

Executors (All time)
Id		Uptime	Host	Port	Emitted	Transferred	Complete latency (ms)	Acked	Failed
[24-24]	29m 4s	storm03	6702	17220	17220	0.000	0	0
[25-25]	29m 4s	storm03	6703	17240	17240	0.000	0	0
[26-26]	29m 11s	storm02	6703	17380	17380	0.000	0	0
[27-27]	29m 4s	storm03	6702	17260	17260	0.000	0	0
[28-28]	29m 4s	storm03	6703	17280	17280	0.000	0	0
5个线程分在3个worker,分布在2台机器上	

Local or Shuffle Grouping：
如果目标Bolt有1个或多个Task都在同一个Worker进程对应的JVM实例中，则Tuple只发送给这些Task
=====================================================================================
storm搭建
ln -s apache-storm-1.0.0 storm
export STORM_HOME=/export/servers/storm
export PATH=$PATH:$STORM_HOME/bin

issue:
	当执行"storm supervisor"命令时，经常会过一会就会出现“Exit 20 storm supervisor”等
	诸如此类的问题
resolve:
	现在比较有效的做法是：将storm.yaml中配置的storm.local.dir目录中的supervisor和workers
	两个目录删除掉。然后就可以再启动了。

vim storm.yaml
=====================================================================================
	#指定storm使用的zk集群
	storm.zookeeper.servers:
	     - "master"
	     - "work1"
	     - "work2"
	#指定storm集群中的nimbus节点所在的服务器
	nimbus.host: "master"
	#指定nimbus启动JVM最大可用内存大小
	nimbus.childopts: "-Xmx1024m"
	#指定supervisor启动JVM最大可用内存大小
	supervisor.childopts: "-Xmx1024m"
	#指定supervisor节点上，每个worker启动JVM最大可用内存大小
	worker.childopts: "-Xmx768m"
	#指定ui启动JVM最大可用内存大小，ui服务一般与nimbus同在一个节点上。
	ui.childopts: "-Xmx768m"
	#指定supervisor节点上，启动worker时对应的端口号，每个端口对应槽，每个槽位对应一个worker
	supervisor.slots.ports:
	    - 6700
	    - 6701
	    - 6702
	    - 6703
=====================================================================================

storm启动命令:
	注意:一定先启动nimbus和ui
	master中启动nimbus和ui:
		nohup storm nimbus &
		nohup storm ui &
	supervis机器上启动:
		nohup storm supervisor &
运行程序:
	storm jar storm-starter-topologies-0.9.2-incubating.jar 
storm.starter.WordCountTopology wordcount
杀死任务命令格式:
	storm kill wordcount4 -w 1
=====================================================================================

十一、kafka
解压：kafka_2.11-0.8.2.2.tgz
	ln -s kafka_2.11-0.8.2.2 kafka
	cp   /export/servers/kafka/config/server.properties
	/export/servers/kafka/config/server.properties.bak
vi  /export/servers/kafka/config/server.properties
#日志清理是否打开
log.cleaner.enable=true

#broker需要使用zookeeper保存meta数据
zookeeper.connect=192.168.52.106:2181,192.168.52.107:2181,192.168.52.108:2181

#zookeeper链接超时时间
zookeeper.connection.timeout.ms=6000

#partion buffer中，消息的条数达到阈值，将触发flush到磁盘
log.flush.interval.messages=10000

#消息buffer的时间，达到阈值，将触发flush到磁盘
log.flush.interval.ms=3000

#删除topic需要server.properties中设置delete.topic.enable=true否则只是标记删除
delete.topic.enable=true

#此处的host.name为本机IP(重要),如果不改,则客户端会抛出:Producer connection to localhost:9092 unsuccessful 错误!
host.name=kafka01

启动命令:
	kafka-server-start.sh  config/server.properties
	kafka-topics.sh --list --zookeeper  storm01:2181
	kafka-topics.sh --create --zookeeper storm01:2181 --replication-factor 2 --partitions 4 --topic orderMq
	kafka-console-producer.sh --broker-list storm01:9092 --topic orderMq
	kafka-console-consumer.sh --zookeeper storm01:2181 --from-beginning --topic orderMq
	
flume+kafka
 vi exec.conf
	# Name the components on this agent
		a1.sources = r1
		a1.sinks = k1
		a1.channels = c1

		a1.sources.r1.type = exec
		a1.sources.r1.command = tail -F /root/logs/1.log
		a1.sources.r1.channels = c1

		# Use a channel which buffers events in memory
		a1.channels.c1.type = memory
		a1.channels.c1.capacity = 10000
		a1.channels.c1.transactionCapacity = 100

		# Bind the source and sink to the channel
		a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
		a1.sinks.k1.topic = orderMq
		a1.sinks.k1.brokerList = storm01:9092
		a1.sinks.k1.requiredAcks = 1
		a1.sinks.k1.batchSize = 20
		a1.sinks.k1.channel = c1
启动命令：
	startzk.sh
	启动flume命令:
			bin/flume-ng agent -n a1 -c conf -f conf/exec.conf -Dflume.root.logger=INFO,console
	nohup kafka-server-start.sh apps/kafka/config/server.properties &
	kafka-console-consumer.sh --zookeeper storm01:2181 --topic orderMq

	sh click_log_out.sh
	for((i=0;i<=50000;i++));
	do echo "message-"+$i >>/root/logs/1.log;
	done

	启动storm:
		nohup storm nimbus &
		nohup storm ui &
	查找某个线程
		ps -ef | grep num
十二、redis
=====================================================================================
	使用yum安装gcc
	对于配备了yum的Linux发行版而言，安装gcc编译器就变得so easy。我们只需要分别执行如下命令即可：

	#root账户下，安装gcc、c++编译器以及内核文件
	su rootyum -y install gcc gcc-c++ kernel-devel

	make MALLOC=libc
=====================================================================================

	Redis下载、编译、安装

	下载redis3.0.5
		wget http://download.redis.io/releases/redis-3.0.5.tar.gz
	解压文件，并创建软件连接
		tar -zxvf  redis-3.0.5.tar.gz -C /export/servers/
		ln  –s  redis-3.0.5/  redis
	编译redis源码
		cd /export/servers/redis 
		make（先安装gcc）
	将编译后的可执行文件安装到/user/local/redis

	安装:
		make install
		make PREFIX=/usr/local/redis
	启动:
		./redis-server ../redis.conf &

十三、spark
	spark-1.6.1-bin-hadoop2.6.tgz


	进入到Spark安装目录
	cd /usr/local/spark-1.5.2-bin-hadoop2.6
	进入conf目录并重命名并修改spark-env.sh.template文件
	cd conf/
	mv spark-env.sh.template spark-env.sh
	vi spark-env.sh
	在该配置文件中添加如下配置
		export JAVA_HOME=/usr/local/jdk1.7.0_45
		export SPARK_MASTER_IP=storm01
		export SPARK_MASTER_PORT=7077

	保存退出
	重命名并修改slaves.template文件
	mv slaves.template slaves
	vi slaves
	在该文件中添加子节点所在的位置（Worker节点）
		storm02
		storm03
	将配置好的Spark拷贝到其他节点上
	scp -r spark-1.5.2-bin-hadoop2.6/ node2.itcast.cn:/usr/local/
	scp -r spark-1.5.2-bin-hadoop2.6/ node3.itcast.cn:/usr/local/
	scp -r spark-1.5.2-bin-hadoop2.6/ node4.itcast.cn:/usr/local/

	Spark集群配置完毕，目前是1个Master，3个Work，在storm01上启动Spark集群
	/usr/local/spark-1.5.2-bin-hadoop2.6/sbin/start-all.sh
	ui界面
	http://storm01:8080/

	单独启动linux spark-shell窗口
	spark-shell --driver-class-path /root/apps/hive/lib/mysql-connector-java-5.1.28.jar


	提交程序：
	spark-shell --master spark://storm01:7077 --total-executor-cores 4 --executor-memory 4g
	该算法是利用蒙特·卡罗算法求PI
	bin/spark-submit --class org.apache.spark.examples.SparkPi  --master spark://storm01:7077 /root/apps/spark-1.6.1-bin-hadoop2.6/lib/spark-examples-1.6.1-hadoop2.6.0.jar 100

	/usr/local/spark-1.5.2-bin-hadoop2.6/bin/spark-submit \
	--class org.apache.spark.examples.SparkPi \
	--master spark://storm01:7077 \
	--executor-memory 1G \
	--total-executor-cores 2 \
	/usr/local/spark-1.5.2-bin-hadoop2.6/lib/spark-examples-1.5.2-hadoop2.6.0.jar \
	100


	sc.textFile("hdfs://storm01:9000/data").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).sortBy(_._2,false).collect

	sc.textFile("hdfs://storm01:9000/data").flatMap(_.split(" ")).map((_,1)).reduceByKey(_+_).sortBy(_._2,false).saveAsTextFile("hdfs://storm01:9000/out")



val list = List("hello world hello pp","new hello pp")

val list2 = list.flatMap(_.split(" ")).map((_,1)).groupBy(_._1).mapValues(_.size).toList.sortBy(_._2)
val list3 = list.flatMap(_.split(" ")).map((_,1)).groupBy(_._1).map(t=>(t._1,t._2.size)).toList.sortBy(_._2)
val list4 = list.flatMap(_.split(" ")).map((_,1)).groupBy(_._1).mapValues(_.foldLeft(0)(_+_._2)).toList.sortBy(_._2)	


	#groupByKey
	val rdd3 = rdd1 union rdd2
	rdd3.groupByKey
	rdd3.groupByKey.map(x=>(x._1,x._2.sum))
	rdd3.groupByKey.mapValues(_.sum)

	#WordCount, 第二个效率低
	sc.textFile("/root/words.txt").flatMap(x=>x.split(" ")).map((_,1)).reduceByKey(_+_).sortBy(_._2,false).collect
	sc.textFile("/root/words.txt").flatMap(x=>x.split(" ")).map((_,1)).groupByKey.map(t=>(t._1, t._2.sum)).collect

	:r! echo


apps/spark-1.6.1-bin-hadoop2.6/bin/spark-submit \
	--class com.less \
	--master spark://storm01:7077 \
	--executor-memory 1G \
	--total-executor-cores 1 \
	Hello-spark-1.0.jar \
	hdfs://storm01:9000/wc hdfs://storm01:9000/out3


bin/spark-sql \
 --master spark://storm01:7077 \
 --executor-memory 1g \
 --total-executor-cores 1 \
 --driver-class-path /root/apps/hive/lib/mysql-connector-java-5.1.28.jar 
3.启动spark-shell时指定mysql连接驱动位置
bin/spark-shell \
 --master spark://storm01:7077 \
 --executor-memory 1g \
 --total-executor-cores 1 \
 --driver-class-path /root/apps/hive/lib/mysql-connector-java-5.1.28.jar


 Spark Streaming+Flume对接实验：
 http://lxw1234.com/archives/2015/05/217.htm
Spark日志分析项目Demo(4)--RDD使用，用户行为统计分析
 http://blog.csdn.net/zhi_fu/article/details/77778675
理解Spark的核心RDD
 http://www.infoq.com/cn/articles/spark-core-rdd/






