from time import sleep
import RPi.GPIO as GPIO

from motor import Motor

pulse_per_revolution = 70

class StepperMotor(Motor):
    '''A stepper motor instance connected to the device'''

    # parameters (order of the dictionary keys is important)
    parameters = {
        'pulse_interval': 300, # in micro seconds
        'degree': 0,
        'direction': 0, # 0 is LOW, 1 is HIGH
        'enable': 0 # 0 is LOW, 1 is HIGH
    }

    def __init__(self, motor_name, pulse_pin, direction_pin, enable_pin):
        # pins
        # note that these pins are based on BCM, see https://pinout.xyz/ and look for GPIO pins
        self.pulse_pin = pulse_pin
        self.direction_pin = direction_pin
        self.enable_pin = enable_pin

        # initialise GPIO
        GPIO.setup(self.pulse_pin, GPIO.OUT)
        GPIO.setup(self.direction_pin, GPIO.OUT)
        GPIO.setup(self.enable_pin, GPIO.OUT)

        super().__init__(motor_name)

    def get_pins(self):
        pins = {'pulse_pin': self.pulse_pin, 'direction_pin': self.direction_pin, 'enable_pin': self.enable_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def run(self):
        # determine total pulse, and delay per pulse
        total_pulse = round(self.parameters['degree'] / 360 * pulse_per_revolution)
        delay = self.parameters['pulse_interval'] * 10 ** (-6)
        print(f"{self.motor_name}.total_pulse = {total_pulse}, delay = {delay}")
        # determine gpio values for direction and enable
        direction_value = GPIO.LOW if self.parameters['direction'] == 0 else GPIO.HIGH
        enable_value = GPIO.LOW if self.parameters['enable'] == 0 else GPIO.HIGH

        GPIO.output(self.enable_pin, enable_value)
        print(f"{self.motor_name}.enable = {self.enable_pin}")

        sleep(0.1) # pause due to a possible change in direction

        GPIO.output(self.direction_pin, direction_value)
        print(f"{self.motor_name}.direction = {direction_value}")

        for i in range(total_pulse):
            GPIO.output(self.pulse_pin, GPIO.HIGH)
            sleep(delay)
            GPIO.output(self.pulse_pin, GPIO.LOW)
            sleep(delay)

        # finish running the required total pulse
        GPIO.output(self.enable_pin, GPIO.LOW)

        sleep(0.5) # pause for possible change direction

    def stop_running(self):
        # disable the motor by setting enable to LOW
        GPIO.output(self.enable_pin, GPIO.LOW)
        sleep(0.5) # pause for a while
