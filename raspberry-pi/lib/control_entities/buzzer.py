from multiprocessing import Process
from time import sleep
import RPi.GPIO as GPIO

from .generic_control_entity import GenericControlEntity

class Buzzer(GenericControlEntity):
    '''A buzzer instance connected to the device'''

    def __init__(self, buzzer_name, gpio_pin, multiprocessing_manager):
        self.buzzer_name = buzzer_name

        # pins
        self.gpio_pin = gpio_pin

        # instance attributes
        self.is_buzzing = False

        # initialise GPIO
        GPIO.setup(gpio_pin, GPIO.OUT)

        # initialise gpio output
        GPIO.output(gpio_pin, GPIO.LOW)

        super().__init__(buzzer_name, multiprocessing_manager = multiprocessing_manager)

    def get_pins(self):
        return {'gpio_pin': self.gpio_pin}

    def buzz(self, duration = None):
        self.is_buzzing = True
        GPIO.output(self.gpio_pin, GPIO.HIGH)
        if duration is not None: sleep(duration)

    def stop_buzzing(self, duration = None):
        self.is_buzzing = False
        GPIO.output(self.gpio_pin, GPIO.LOW)
        if duration is not None: sleep(duration)

    def run(self, is_running, run_arguments, tracked_parameters):
        # pause for a while
        sleep(0.1)

        # loop
        while True:
            self.buzz(0.1)
            self.stop_buzzing(0.2)
            self.buzz(0.1)
            self.stop_buzzing(3)

        # call parent method to finish running
        super().run(is_running)

    def stop_running(self):
        sleep(1) # pause in-case it is buzzing
        # disable the buzzer
        self.stop_buzzing()

        # call parent method
        super().stop_running()
