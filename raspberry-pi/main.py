#!/usr/bin/python3

import dbus
import RPi.GPIO as GPIO
from multiprocessing import Manager
from dotenv import load_dotenv

from lib.bluetooth.advertisement import Advertisement
from lib.bluetooth.service import Application

from lib.robot_controller_service import RobotControllerService

class RobotControllerAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("Robot Controller")
        self.include_tx_power = True

def main():
    load_dotenv()

    GPIO.setmode(GPIO.BCM)
    multiprocessing_manager = Manager()

    app = Application()

    service = RobotControllerService(0, multiprocessing_manager)

    app.add_service(service)
    app.register()

    adv = RobotControllerAdvertisement(0)
    adv.register()

    try:
        app.run()
    except KeyboardInterrupt:
        service.set_is_running(False)
        app.quit()
        GPIO.cleanup()

if __name__ == '__main__':
    main()
