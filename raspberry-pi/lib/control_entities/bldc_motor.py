from time import sleep
import RPi.GPIO as GPIO

from .motor import Motor

class BLDCMotor(Motor):
    '''A brushless dc motor instance connected to the device'''

    # class attribute: list of parameters (order is important)
    parameters_keys = ['pwm_duty_cycle', 'pwm_frequency', 'direction', 'enable', 'brake', 'duration']
    # class attribute: list of tracked parameters (order is important)
    tracked_parameters_keys = ['running_duration']

    def __init__(self, motor_name, pwm_pin, direction_pin, enable_pin, brake_pin, multiprocessing_manager = None, initial_parameters = None):
        # pins
        self.pwm_pin = pwm_pin
        self.direction_pin = direction_pin
        self.enable_pin = enable_pin
        self.brake_pin = brake_pin

        # parameters dictionary
        self.parameters = {
            'pwm_duty_cycle': 0,
            'pwm_frequency': 1000,
            'direction': 0,
            'enable': 0, # 0 is HIGH, 1 is LOW
            'brake': 0,
            'duration': 0
        } if initial_parameters is None else initial_parameters

        # initialise GPIO
        GPIO.setup(pwm_pin, GPIO.OUT)
        GPIO.setup(direction_pin, GPIO.OUT)
        GPIO.setup(enable_pin, GPIO.OUT)
        GPIO.setup(brake_pin, GPIO.OUT)

        # initialise enable, and brake outputs
        GPIO.output(enable_pin, GPIO.LOW)
        GPIO.output(brake_pin, GPIO.LOW)

        # create motor pwm object
        self.motor_pwm = GPIO.PWM(self.pwm_pin, pwm_frequency_value)
        self.motor_pwm.start(0)

        super().__init__(motor_name, multiprocessing_manager)

    def get_pins(self):
        pins = {'pwm_pin': self.pwm_pin, 'direction_pin': self.direction_pin, 'enable_pin': self.enable_pin, 'brake_pin': self.brake_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def run(self, is_running, tracked_parameters):
        sleep(0.1) # pause due to a possible change in direction

        # determine pwm duty cycle, pwm frequency, direction, enable, brake, duration
        pwm_duty_cycle_value = 0
        if self.parameters['pwm_duty_cycle'] < 0: pwm_duty_cycle_value = 0
        elif self.parameters['pwm_duty_cycle'] > 100: pwm_duty_cycle_value = 100
        else: pwm_duty_cycle_value = self.parameters['pwm_duty_cycle']

        pwm_frequency_value = self.parameters['pwm_frequency'] if self.parameters['pwm_frequency'] > 0 else 1000

        print(f"{self.motor_name}.pwm_duty_cycle = {pwm_duty_cycle_value}, pwm_frequency = {pwm_frequency_value}")

        direction_value = GPIO.LOW if self.parameters['direction'] == 0 else GPIO.HIGH
        print(f"{self.motor_name}.direction = {direction_value}")

        enable_value = GPIO.HIGH if self.parameters['enable'] == 0 else GPIO.LOW
        print(f"{self.motor_name}.enable = {enable_value}")

        duration_value = self.parameters['duration']
        print(f"{self.motor_name}.duration = {duration}")

        # update motor pwm object based on a possibly new pwm frequency value
        self.motor_pwm = GPIO.PWM(self.pwm_pin, pwm_frequency_value)
        self.motor_pwm.start(0)

        # set the enable output
        GPIO.output(self.enable_pin, enable_value)
        # set the brake output to LOW
        GPIO.output(self.brake_pin, GPIO.LOW)

        # actual running by gradually increasing pwm duty cycle from 0
        for i in range(pwm_duty_cycle + 1):
            self.motor_pwm.ChangeDutyCycle(i)
            sleep(0.005)

        # run duration
        for i in range(duration_value * 100):
            sleep(0.01)

        # stop the motor as it finished running the required duration
        self.stop_running()

        # call parent method to finish running
        super().run(is_running, tracked_parameters)

    def stop_running(self):
        # stop the motor based on whether sudden braking is required
        sudden_brake = 0 if self.parameters['brake'] == 0 else 1

        self.motor_pwm.ChangeDutyCycle(0)
        if sudden_brake:
            GPIO.output(self.brake_pin, GPIO.HIGH)
        else:
            GPIO.output(self.enable_pin, GPIO.HIGH)

        sleep(0.5) # pause for a while
