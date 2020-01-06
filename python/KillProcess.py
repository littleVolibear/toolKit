# coding=utf-8
import os

out = os.popen("tasklist").read()
ppid = ""
for line in out.splitlines():
    print(line)
    if 'Seer.exe' in line:
        ppid = str(line.split()[1])
        # cmd = 'TASKKILL -F /FI ' + '"PID eq ' + ppid + '"'
        cmd = 'TASKKILL /PID ' + ppid + ' /t /f'
        # 方式一 os.system(cmd)
        # 方式二
        read = os.popen(cmd).read()
verify = 'tasklist | findstr ' + '"' + ppid + '"'
read = os.popen(verify).read()
if(len(read)==0):
    print("kill success")



