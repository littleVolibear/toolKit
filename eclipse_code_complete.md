## eclipse 自动补全功能(去掉等号、分号、空格按键后的代码自动补全功能)
* ### *设置代码提示*
```
打开 Eclipse 依次选择
Window -> Perferences -> Java -> Editor -> Content Assist，Auto activation triggers for Java：设置框中默认是"."   现在将它改为：
.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_

```
>。但是现在有一个比较大的问题是，Eclipse智能过头了，它总想帮我们完成一些我们不想要的代码补完。比如按“=”和空格以后就会自动补完代码，这对很多人真的不能忍。

* ### *去掉等号、分号、空格按键后的代码自动补全功能*
```
幸好Eclipse是开源软件，解决办法是直接修改代码提示功能的源代码，以完成我们需要的功能。

首先打开window->show view，选择Plug-ins，再找到org.eclipse.jface.text，右键单击，选择import as－> Source Project，导入完成后，在你的workspace就可以看到这个project了。如果没有src这个文件夹，说明你使用的版本中没有带源代码，我正好也是这种情况。

源代码可以去这个地址下载（找了我好久好久）

http://archive.eclipse.org/eclipse/downloads/

在页面上选择你Eclipse版本的连接（我使用的是4.4.2），然后在新页面中下载eclipse-SDK-(*************).zip，根据自己的需要选择合适的版本下载，大概200M左右。下载完成以后解压缩，在.\eclipse\plugins\文件夹下找到  org.eclipse.jface.text.source_3.9.2.v20141003-1326.jar  （这是对应我使用的Eclipse版本的文件，实际请根据你自己的版本进行选择），将这个文件复制到你自己的Eclipse安装目录下的.\eclipse\plugins\文件夹下，然后重新启动Eclipse。重复上面的操作导入(import)org.eclipse.jface.text，此时就能够看到src文件夹了。在src文件夹下org.eclipse.jface.text.contentassist.CompletionProposalPopup#verifyKey()”函数中有一段代码:

if(contains(triggers, key)){
...
}
将这段代码改为

if(key!=0x20 && key!='=' && key!=';' && key!='[' && contains(triggers, key)){
    ...
}

最后就是导出修改后的插件，右键点击你的workspace里的工程，选择Export－>Deployable plugins and fragments，点击Next，选择Destination选项卡，选择Directory，选择一个要保存插件的目录，然后Finish。然后就会在你所选的目录下产生一个新的plugins目录，里面有一个jar文件，用它替换掉eclipse/plugins里面的org.eclipse.jface.text，记得覆盖前对原文件进行备份。然后重新启动Eclipse。
```