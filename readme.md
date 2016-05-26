# 自动更新程序

## 注意
### Node 扩展 
* 如果是使用 GitHub 请使用 github-webhook-handler 
* 如果是使用 Gitlab 请使用 gitlab-webhook-handler

> 请修改 server.js 的包引入

## 配置
* 为了使相同通一套程序可以为多个项目进行自动更新，需要配置 `config.json`

	* 例子
		
			{
			  "name": "auto update ",
			  "version": "1.0.0",
			  "list": {
			      "project": {
			        "name" : "project",
			        "desc" : "XX项目",
			        "script" : "deploy.sh",
			        "token" : "youtoken"
			      }
			  }
			}
		
	* 使用
		
		> http://0.0.0.0:7777/webhook?token=youtoken&name=project

## 脚本
* 根据需要进行配置
* 将脚本放入 `script` 目录中

```shell
	#!/bin/bash 
	WEB_PATH='/data/wwwroot/deploy'
	WEB_USER='root'
	WEB_USERGROUP='root'

	echo "Start deployment"
	cd $WEB_PATH
	echo 'pulling source code...'
	git reset --hard origin/master
	git clean -f
	git pull origin master
	git checkout master
	echo "changing permissions..."
	chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
	echo "Finished."
```
	
## 运行
* node server.js 或 npm start

> 当然为了防止 NodeJS 自己挂掉，我们可以启用进程管理服务 forever，它类似 python 里面的 supervisor。 
> 
> npm install -g forever
> 
> forever start server.js
> 
> forever list
> 
> forever stop 1
> 
> forever restartall

### 免密码登录
* git@xx.com

	> 使用 ssk key

* HTTPS 方式

	> 对于HTTPS方式，你可以在 `~/.netrc` 文件里设定用户名密码，不过这样的风险在于密码是明文存放在这个文件里的，比较容易泄露
	
	```
	machine github.com
	login Username
	password Password
	```