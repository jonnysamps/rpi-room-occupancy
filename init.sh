#!/bin/bash
# chkconfig:   - 86 16
# Server Control Script. May have to be run as root depending on the setup of your system.

APPROOT="/home/pi/projects/rpi-room-occupancy"
cd ${APPROOT}
PIDFILE="/tmp/.occ.pid"

#CONFIGFILE="/etc/gc-server/config.json"
#CONFIGFILE="/Users/jonnysamps/Documents/development/productops/git/gc/gc-reporting-service/config.example.json"

NODESERVER="$APPROOT/main.js"
LOGROOT='/var/log/rpi-room-occupancy'
LOGFILE="$LOGROOT/app.log"

NODE=/usr/local/bin/node

# Some Colors for readability
strong=$(tput bold)             # Bold
error=$(tput setaf 1)           #  red
good=$(tput setaf 2)            #  green
warn=$(tput setaf 3)            #  yellow
info=$(tput setaf 7)            #  gray
heading=${strong}$(tput setaf 6)         #  white
reset=$(tput sgr0)              # Reset

function test {
    echo "$1"
}

# Make sure that all log files/directories are in place
function init {
    if [ ! -d $LOGROOT ]
    then
        mkdir -p $LOGROOT
        if [ $? -eq 0 ]
        then
            echo "${good}Logging dir created${reset}"
        else
            echo "${error}Failed to create logging dir${reset}"
            exit 1
        fi
    fi
}

function start {
    init
    # See if the server is up... if so, restart
    PID=`cat $PIDFILE` > /dev/null >& /dev/null
    ps "$PID" > /dev/null >& /dev/null
    if [ $? -eq 0 ]
    then
	stop
    fi

#    if [ ! -e "$CONFIGFILE" ]
#    then
#        echo "${warn}Config file not found ... using defaults"
#        echo "Config File: $CONFIGFILE${reset}"
#    fi

    nohup ${NODE} $NODESERVER >> $LOGFILE 2>&1 &

    if [ $? -eq 0 ]
    then
        PID=$!
        ps "$PID" > /dev/null >& /dev/null
        if [ $? -eq 0 ]
        then
            echo "${good}Server Started ${reset}"
            echo $PID > $PIDFILE
            echo "${info}PID: $PID"
        else
            echo "${error}Server failed to start${reset}"
        fi
    else
	    echo "${error}Server failed to start ${reset}"
    fi
}

function stop {
     PID=`cat $PIDFILE` > /dev/null >& /dev/null
     ps "$PID" > /dev/null >& /dev/null
     if [ $? -eq 0 ]
     then
	     if(kill $PID)
		     then
		         echo "${good}Stopped Server${reset}"
			     else
		         echo "${error}Failed to stop Server: PID: $PID ${reset}"
			     fi
     else
	     echo "${warn}Server already down"
     fi
}

function status {
     PID=`cat $PIDFILE`
     ps "$PID" > /dev/null >& /dev/null
     if [ $? -eq 0 ]
     then
	     echo "${info}Server: ${good}Running ${info}[ $PID ] ${reset}"
     else
	     echo "${info}Server: ${warn}Down${reset}"
     fi
}

function usage {
    echo "${info}Usage: serverctl <${reset}COMMAND${info}>"
    echo "       ${reset}COMMAND${info} options:"
    echo "            ${warn}status${info} - Get Up/Down status of the server"
    echo "            ${warn}start${info}  - Start the server"
    echo "            ${warn}stop${info}   - Stop the server"
    echo "            ${warn}restart${info} -  Stop then start"
}

case "$1" in
     status)
         status
	 ;;
     start)
         echo "${info}Starting Occupancy Sensor"
        start
      	;;
     stop)
        echo "${info}Stopping Occupancy Sensor"
	stop
	;;
     restart)
        echo "${info}Restarting..."
	stop
	start
	;;
    *)
        usage
	;;
esac

echo ${reset}
exit 0