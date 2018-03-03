# Assumes that you've committed your work on your current branch
# 
# OSX must be installed brew first
# 
# Debian and Ubuntu repositories. Install using sudo apt-get install jq.
# Fedora repository. Install using sudo dnf install jq.
# openSUSE repository. Install using sudo zypper install jq.
# repository. Install using sudo pacman -Sy jq.
# 
# 检测是否安装命令后jason解析器
# 
if hash jq 2>/dev/null;
    then
       echo "jq installed!!"
    else
       if hash brew 2>/dev/null;
         then
            brew install jq
         else
            echo "Please refer to the comment installation for the jq tool in the corresponding OS."
       fi
fi

#fork同步源
function sync_fork() {
   current_branch=$(git rev-parse --abbrev-ref HEAD)
  
   git fetch upstream
   git checkout master
   git merge upstream/master
   git push # origin
   git checkout $current_branch
}

#读取package.json 中的源地址
orgin_git=$(cat package.json | jq '.repository.url')
orgin_git=${orgin_git##*+}
orgin_git=${orgin_git%%"\""}

#检查local项目是否存在upstream 
#存在直接同步fork
#不存在为fork添加upstream
my_remote_repository=$(git remote -v)
echo $my_remote_repository
if [[ $my_remote_repository =~ "upstream" ]]
then
   sync_fork
else
   git remote add upstream $orgin_git
   sync_fork
fi
