#查看三台机器的jps

#!/bin/bash
for i in root@learn01 root@learn02 root@learn03
do
    echo "===========        $i        ==========="
    ssh $i '/opt/module/jdk1.8.0_144/bin/jps'
done