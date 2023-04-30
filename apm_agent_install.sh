#!/bin/bash
function help()
{
#usage
cat << HELP
Usage  : please switch to root account in order to run this script.
Options:
    ak          : access key
    sk          : security key
    code        : aom access code
    region      : region in xxxx
    projectid   : project id in iam
    obsdomain   : the obs domain, default value is xxx domain
    accessip    : the elb ip addr
    plugoff     : the plugin need to disable, eg: log
Example:
    bash apm_agent_install.sh -accessip 192.168.0.1 -accessdomain xxx;
    bash apm_agent_install.sh -accessip 192.168.0.1 -accessdomain xxx -obsdomain domain obs.xxxx.xxx;
    bash apm_agent_install.sh -ak master -sk master -region xxxx -projectid master
    bash apm_agent_install.sh -ak sdd8268daw8 -sk asdfdpkmd89s -projectid 78ssssffff8963s -region xxxx;
    bash apm_agent_install.sh -ak sdd8268daw8 -sk asdfdpkmd89s -projectid 78ssssffff8963s -region xxxx -accessip 192.168.0.1 -accessdomain xxx -obsdomain obs.xxxx.xxx;
    bash apm_agent_install.sh -code asdfdpkmd89s -projectid 78ssssffff8963s -region cn-north-1 -accessip 192.168.0.1 -accessdomain xxx -obsdomain obs.xxxx.xxx;
    bash apm_agent_install.sh -ak sdd8268daw8 -sk asdfdpkmd89s -projectid 78ssssffff8963s -region xxxx -plugoff log;
    bash apm_agent_install.sh -scene internet -ak sdd8268daw8 -sk asdfdpkmd89s -projectid 78ssssffff8963s -accessip 192.168.0.1 -accessdomain xxx;
HELP
exit 1
}

function checkUser()
{
    if [ "root" != "${CURRENT_USER}" ]
    then
        echo "please switch to root account in order to run this script."
        help
        exit 1
    fi
}

function checkOption()
{
    key=$1
    if [ "$key" = "-ak" -o "$key" = "-sk" -o "$key" = "-region" -o "$key" = "-projectid" \
            -o "$key" = "-obsdomain" -o "$key" = "-accessip" -o "$key" = "-scene" \
            -o "$key" = "-dc" -o "$key" = "-plugoff" -o "$key" = "-code" -o "$key" = "-accessdomain" \
            -o "$key" = "-amsdomain" -o "$key" = "-alsdomain" ];
    then
        return 1
    fi
    return 0
}

function checkArgs()
{
    param_num=$#
    if [ $param_num -eq 0 ];then
        return
    fi
    
    #check options
    for i in `seq $param_num | awk 'i=!i'`
    do
        if checkOption "${!i}"
        then
            echo -e "\e[1;41mERROR\e[0m : unknown parameter \e[1;31m${!i}\e[0m"
            help
        fi
    done

    res=0;a=1;b=2;c=4;d=8;e=16;
    for i in `seq $(($param_num/2))`
    do
        [[ ${1#-} == "ak" ]] && { AK=$2;res=$[$res|$a];a=128;shift 2;continue; }
        [[ ${1#-} == "sk" ]] && { SK=$2;res=$[$res|$b];b=128;shift 2;continue; }
        [[ ${1#-} == "region" ]] && { REGION_CODE=$2;res=$[$res|$c];c=128;shift 2;continue; }
        [[ ${1#-} == "projectid" ]] && { PROJECTID=$2;res=$[$res|$d];d=128;shift 2;continue; }
        [[ ${1#-} == "obsdomain" ]] && { OBSDOMAIN=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "accessip" ]] && { ACCESSIP=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "scene" ]] && { SCENE=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "dc" ]] && { DC=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "plugoff" ]] && { PLUGOFF=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "code" ]] && { AOM_ACCESS_CODE=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "accessdomain" ]] && { ACCESSDOMAIN=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "amsdomain" ]] && { AMSDOMAIN=$2;res=$[$res|$d];e=128;shift 2;continue; }
        [[ ${1#-} == "alsdomain" ]] && { ALSDOMAIN=$2;res=$[$res|$d];e=128;shift 2;continue; }
    done

}

#=================================main entrance=============================

CURRENT_USER="`/usr/bin/id -u -n`"
checkUser
checkArgs $@

if [ "$AK" == "{input_your_ak}" -a "$SK" == "{input_your_sk}" ];then
	echo "Enter the AK:"
	read ak
	AK=$ak
	echo "Enter the SK:"
	stty -echo
	read sk
	stty echo
	SK=$sk
fi

echo "start to install ICAgent."
packageHome=/opt/ICAgent
mkdir -p $packageHome;

if [ X"$REGION" = X"" ];then
    echo -e "\e[1;41mERROR\e[0m : REGION lack, please refer to user installation guide";
    echo -e "Example:   "
    echo -e "    \e[1;41mREGION={region}\e[0m bash apm_agent_install.sh -ak -sk -region {region} -projectid ;";
    exit 1
fi

if [ X"${REGION_CODE}" = X"" ];then
    REGION_CODE=$REGION
fi

#default HWS
urlPostfix="obs.$REGION.myhuaweicloud.com"
if [ X"${OBSDOMAIN}" != X"" ];then
    urlPostfix=${OBSDOMAIN}
fi

agentUrl=icagent-${REGION_CODE}.${urlPostfix}
if [ X"${REPODOMAIN}" != X"" ];then
    export REPODOMAIN=$REPODOMAIN
    
    if [ X"${ACCESSIP}" == X"" ];then
        iparr=(${REPODOMAIN//:/ })
        ACCESSIP=${iparr[0]}
    fi

    echo "begin to download install package from $REPODOMAIN."
    curl --progress-bar -o $packageHome/ICProbeAgent.tar.gz -k https://${REPODOMAIN}/v1/repos/ICAgent_linux/ICProbeAgent.tar.gz; 
else
    echo "begin to download install package from $agentUrl."
    curl --progress-bar -o $packageHome/ICProbeAgent.tar.gz http://${agentUrl}/ICAgent_linux/ICProbeAgent.tar.gz; 
fi

if [ $? != 0 ]
then
    echo -e "\e[1;41mERROR\e[0m : download install package failed, please retry";
    exit 1;
fi
echo "download success."
echo "start install package."
tar -zxvf $packageHome/ICProbeAgent.tar.gz -C $packageHome >/dev/null 2>&1
chmod -R 750 $packageHome >/dev/null 2>&1

if [ X"${SCENE}" = X"internet" -a X"$ACCESSIP" = X"" ];then
    echo "accessip is essential args, please input."
    help
    exit 1
fi


#special process
if [ X"${REGION_CODE}" = X"" ];then
    REGION_CODE="reserved_region"
fi
if [ X"${OBSDOMAIN}" = X"" ];then
    OBSDOMAIN="obs.$REGION_CODE.myhuaweicloud.com"
fi
if [ X"${SCENE}" = X"" ];then
    SCENE="hws"
fi
if [ X"${PLUGOFF}" = X"" ];then
    PLUGOFF="reserved"
fi

if [ X"${ACCESSDOMAIN}" = X"" ];then
    ACCESSDOMAIN=$ACCESSIP
fi

AmsArg=
if [ X"${AMSDOMAIN}" != X"" ];then
  AmsArg='-amsdomain '$AMSDOMAIN
fi

AlsArg=
if [ X"${ALSDOMAIN}" != X"" ];then
  AlsArg='-alsdomain '$ALSDOMAIN
fi

#old args format
if [ X"${AK}" != X"" ];then
    if [ X"${ACCESSIP}" == X"" ];then
        bash $packageHome/bin/manual/setup.sh -ak $AK -sk $SK -projectid $PROJECTID -region $REGION_CODE -plugoff $PLUGOFF -obsdomain $OBSDOMAIN $AmsArg $AlsArg;
    else
        bash $packageHome/bin/manual/setup.sh -ak $AK -sk $SK -projectid $PROJECTID -region $REGION_CODE -ip $ACCESSIP:9999 -accessdomain $ACCESSDOMAIN -plugoff $PLUGOFF -obsdomain $OBSDOMAIN -scene $SCENE $AmsArg $AlsArg -dc $DC;
    fi
else
    #new args format, just support two format bellows
    #bash apm_agent_install.sh -accessip 1.2.3.4
    #bash apm_agent_install.sh -accessip 1.2.3.4 -obsdomain obs.xxxx.xxx

    #accessip is essential args
    if [ X"${ACCESSIP}" == X"" ];then
        echo "accessip is essential args, please input."
        help
        exit 1
    fi
    if [ X"${AOM_ACCESS_CODE}" == X"" ];then
        retcode=`curl --connect-timeout 5 -m 5 -o /dev/null -s -w %{http_code}  http://169.254.169.254/openstack/latest/securitykey`
        if [ X"$retcode" != X"200" ];then
            echo -e "\e[1;41mERROR\e[0m : can't get securitykey info from openstack, please check ecs agency.";
            exit 1
        fi
        bash $packageHome/bin/manual/setup.sh -ip $ACCESSIP:9999 -accessdomain $ACCESSDOMAIN -plugoff $PLUGOFF -region $REGION_CODE -obsdomain $OBSDOMAIN $AmsArg $AlsArg;
    else
        bash $packageHome/bin/manual/setup.sh -ip $ACCESSIP:9999 -accessdomain $ACCESSDOMAIN -plugoff $PLUGOFF -projectid $PROJECTID -region $REGION_CODE -obsdomain $OBSDOMAIN -code $AOM_ACCESS_CODE $AmsArg $AlsArg;
    fi
fi

if [ -d $packageHome ];then
        chmod 600 $packageHome/release_version.properties
        chmod 600 $packageHome/envs/*
        chmod 600 $packageHome/config/*
        rm -f $packageHome/bin/aarch64/.gitkeep >/dev/null 2>&1
        rm -f $packageHome/bin/x86_64/.gitkeep >/dev/null 2>&1
        chmod -R 550 $packageHome/bin >/dev/null 2>&1
fi
