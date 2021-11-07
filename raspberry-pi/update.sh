#!/bin/bash

echo "Updating blue-nebula for raspberry-pi..."

echo "Stopping systemd services"
sudo systemctl stop main.service
sudo systemctl stop temperature_logging.service
echo "Finished stopping"

echo "Pulling source code from github..."
git -C $HOME/Documents/blue-nebula pull
echo "Finished pulling source code"

# restart systemd services
echo "Restarting systemd services..."
sudp systemctl daemon-reload
sudo systemctl start main.service
sudo systemctl start temperature_logging.service
echo "Finished restarting"

echo "Finished updating"
