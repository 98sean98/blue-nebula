#!/bin/bash

echo "Installing blue-nebula for raspberry pi..."

SOURCE_CODE_DIRECTORY=$HOME/Documents/blue-nebula

echo "Micro app name: $MICRO_APP_NAME"

if [ -z ${MICRO_APP_NAME+x} ]
then
    echo "MIRCO_APP_NAME environment variable has not be set"
    echo "Please set it by doing: export MICRO_APP_NAME=<micro_app_name>"
    exit 1
fi

# enable and start ssh
echo "Starting and enabling ssh..."
sudo systemctl enable ssh
sudo systemctl start ssh
echo "Finished starting and enabling ssh"

# install vim
echo "Silently installing vim using apt..."
sudo apt install -y -q vim
echo "Finished installing vim"

# download source code from github
echo "Downloading source code from github..."
git clone https://github.com/98sean98/blue-nebula.git $SOURCE_CODE_DIRECTORY
echo "Finished downloading source code from github"

# enable experimental features for bluez
echo "Enabling experimental features for bluez"
DBUS_FILE=/etc/systemd/system/dbus-org.bluez.service
DBUS_TEMP_FILE=$SOURCE_CODE_DIRECTORY/raspberry-pi/temporary-dbus-systemfile
sudo sed 's|^ExecStart=/usr/lib/bluetooth/bluetoothd$|ExecStart=/usr/lib/bluetooth/bluetoothd -E|' $DBUS_FILE > $DBUS_TEMP_FILE
sudo mv $DBUS_TEMP_FILE $DBUS_FILE
echo "Finished enabling experimental features for bluez"

# install python packages
echo "Installing python packages..."
pip3 install -r $SOURCE_CODE_DIRECTORY/raspberry-pi/requirements.txt
echo "Finished installing python packages"

# write the micro app name in the environment file
echo "Writing MICRO_APP_NAME=$MICRO_APP_NAME in raspberry-pi/.env"
echo "MICRO_APP_NAME=$MICRO_APP_NAME" > $SOURCE_CODE_DIRECTORY/raspberry-pi/.env
echo "Finished writing raspberry-pi/.env"

# move services into systemctl
echo "Moving services into systemctl..."
sudo cp $SOURCE_CODE_DIRECTORY/raspberry-pi/systemd/* /etc/systemd/system/
echo "Finished moving services into systemctl"

# start and enable services
echo "Starting and enabling services..."
sudo systemctl daemon-reload
sudo systemctl enable main.service
sudo systemctl enable temperature-logging.service
sudo systemctl start main.service
sudo systemctl start temperature-logging.service
sudo systemctl enable blue-nebula.target
sudo systemctl start blue-nebula.target
echo "Finished starting and enabling services"

echo "Finished installing everything. A reboot is necessary to execute blue-nebula."
echo "Reboot initiates in 30s. To cancel, press CTRL+C. This does not affect this installation. Just make sure to shutdown the raspberry pi normally."
sleep 30s
sudo reboot
