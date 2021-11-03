# Raspberry Pi

Python GATT bluetooth server for the Raspberry Pi.

## Setup
There are a number of steps required to setup the Raspberry Pi. Please read this document very carefully.

0. Open a terminal

1. Setup wifi
```sh
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

  Write the following
  ```text
  ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
  update_config=1
  country=HK

  network={
  	ssid="WIFI_NAME"
  	psk="WIFI_PASSWORD"
  }

  // example (do not write the following)
  network={
  	ssid="Sean's iPhone"
  	psk="Iamawesome"
  }
  ```

  Then, run
  ```sh
  wpa_cli -i wlan0 reconfigure
  ```

2. Enable ssh
```sh
sudo systemctl enable ssh
sudo systemctl start ssh
```

3. Install vim (optional)
```sh
sudo apt install vim
```

4. Clone the repository from Github
```sh
cd Documents
git clone https://github.com/98sean98/blue-nebula.git
```

5. Enable experimental features for `bluez`
```sh
sudo nano /etc/systemd/system/dbus-org.bluez.service
```

  Add `-E` to `ExecStart` line -> `ExecStart=/usr/lib/bluetooth/bluetoothd -E`.

6. Install python packages
```sh
cd blue-nebula/raspberry-pi
pip3 install -r requirements.txt
```

7. Setup the micro app name in the environment
```sh
# replace sample with a name of your choice
echo "MICRO_APP_NAME = sample" > .env
```

  7a. [Optional] Create a new micro app

  If you do not see the micro app you want to use, create it yourself. See [here](#new-micro-app).

8. Move services into systemctl
```sh
sudo cp systemd/* /etc/systemd/system/
```

9. Start and enable services
```sh
sudo systemctl daemon-reload
sudo systemctl enable main.service
sudo systemctl enable temperature-logging.service
sudo systemctl start main.service
sudo systemctl start temperature-logging.service
sudo systemctl enable blue-nebula.target
sudo systemctl start blue-nebula.target
```

## Usage
Once you manage to set everything up, simply reboot the raspberry pi.

```sh
sudo reboot
```

On the reboot and subsequent bootups, the python programs are executed automatically as start up scripts. If you have connected a buzzer to the designated buzzer pins, you should hear health check beeps which indicate the raspberry pi is working nominally, and you should connect to it via the mobile app. Once a bluetooth connection is established between the raspberry pi and a mobile device, the beeps will stop.

## Program health checks
There are a number of methods to perform health checks on the device.

### Main python program
To check if the main python program is running alright, in a terminal, run
```sh
systemctl status main.service
```
- You should look for an `active` keyword highlighted in green in the console log. If it can be found, that means the main python program is running nominally.

- If you see a `loaded` keyword highlighted in grey, that means the service is loaded but not started. Simply start the service by running
```sh
sudo systemctl start main.service
```
You should also enable the service so that it runs automatically on rasperry pi startup.
```sh
sudo systemctl enable main.service
```

- If you see a `failure` keyword highlighted in red, that means the service has been started, but failed.

  Double check your setup, making sure that all requirements such as python package installation, environment variables, etc. are fulfilled.

  After that, restart the service.
  ```sh
  sudo systemctl restart main.service
  ```

### Temperature logging
A python program running in the background checks the hardware temperature, and logs it into a `.csv` file every 5 seconds. This is useful to check if the raspberry pi has ever encountered high temperatures in the operating environment.

To check if the program is running, follow the steps outlined for the main python program above, while replacing `main.service` with `temperature-logging.service`.

To check the temperature logs,
```sh
# go into the logs directory
cd ~/Documents/blue-nebula/raspberry-pi/temperature_logging/logs

# list the available logs by filename
ls

# print a log in the console
cat "filename"
# example: cat "2021-05-03 15:12:32.csv"
```

## <a name="new-micro-app"></a> Setting up a new micro app
If you are setting this up to work on a new robot project, you should create a new micro app setup that should be saved into version control.

*Micro app names that are absolutely not permitted*
- sample
- micro_app

```sh
# go into the micro apps directory
cd ~/Documents/blue-nebula/raspberry-pi/lib/config/micro_apps

# create a new file, replace new_micro_app_name with a name of your choice
nano new_micro_app_name.py
```

Make sure to write this file according to the [specifications](lib/control_entities) of the control entities you intend to use.

Then, replace the `MICRO_APP_NAME` environment variable in `.env`.
```sh
# go back to the raspberry pi directory
cd ~/Documents/blue-nebula/raspberry-pi

# replace new_micro_app_name with a name of your choice
echo "MICRO_APP_NAME = new_micro_app_name" > .env
```

Restart any systemd services, if they were started using another micro app.
```sh
sudo systemctl stop main.service
sudo systemctl daemon-reload
sudo systemctl start main.service
```

## Credits
The GATT server source code is from [Douglass Otwell's cpu temperature example](https://github.com/douglas6/cputemp). All credits related to the design of the bluetooth interface belong to him.
