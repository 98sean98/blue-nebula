from time import sleep
import RPi.GPIO as GPIO

from .generic_control_entity import GenericControlEntity

class Relay(GenericControlEntity):
    '''A relay instance connected to the device'''

    # class attribute: list of parameters (order is important)
    parameters_keys = ['gpio_state', 'enable', 'permanent_change', 'duration']

    def __init__(self, relay_name, gpio_pin, initial_parameters, multiprocessing_manager):
        self.relay_name = relay_name

        # pins
        self.gpio_pin = gpio_pin

        # parameters dictionary
        self.parameters = {
            'gpio_state': 0,
            'enable': 0,
            'permanent_change': 0,
            'duration': 0
        } if initial_parameters is None else initial_parameters

        # initialise GPIO
        GPIO.setup(gpio_pin, GPIO.OUT)

        # initialise gpio output
        GPIO.output(gpio_pin, self.parameters['gpio_state'])

        super().__init__(motor_name, run_arguments, multiprocessing_manager)

    def get_pins(self):
        pins = {'gpio_pin': self.gpio_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def run(self, is_running, run_arguments, tracked_parameters):
        # determine gpio state
        gpio_state = GPIO.HIGH if self.parameters['gpio_state'] == 1 else GPIO.LOW
        print(f"{self.relay_name}.gpio_state = {gpio_state}")

        # determine if it is enabled, the change should be permanent, and duration if not permanent
        enable = self.parameters['enable'] == 1
        permanent_change = self.parameters['permanent_change'] == 1
        duration = self.parameters['duration']
        print(f"{self.relay_name}.enable = {enable}, permanent_change = {permanent_change}, duration = {duration}")

        # run only if enabled
        if enable:
            # set the gpio state
            GPIO.output(self.gpio_pin, gpio_state)

            # sleep the duration only if permanent_change is false
            if not permanent_change:
                sleep(duration)

        super().run(is_running)

    def stop_running(self):
        # set the gpio state to the opposite of what it is
        gpio_state = GPIO.LOW if self.parameters['gpio_state'] == 1 else GPIO.HIGH

        GPIO.output(self.gpio_pin, gpio_state)
