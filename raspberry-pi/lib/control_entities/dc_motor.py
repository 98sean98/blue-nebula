from time import sleep
import RPi.GPIO as GPIO

from .motor import Motor

from .. import utilities

class DCMotor(Motor):
    '''A dc motor instance connected to the device'''

    # class attribute: list of parameters (order is important)
    parameters_keys = ['pwm_duty_cycle', 'pwm_frequency', 'direction', 'enable', 'duration']
    # class attribute: list of tracked parameters (order is important)
    tracked_parameters_keys = ['running_duration']

    def __init__(self, motor_name, pwm_pin, en1_pin, en2_pin, multiprocessing_manager = None, initial_parameters = None):
        # pins
        self.pwm_pin = pwm_pin
        self.en1_pin = en1_pin
        self.en2_pin = en2_pin

        # parameters dictionary
        self.parameters = {
            'pwm_duty_cycle': 0,
            'pwm_frequency': 1000,
            'direction': 0,
            'enable': 0, # software-only enable
            'duration': 0
        } if initial_parameters is None else initial_parameters

        # initialise GPIO
        GPIO.setup(pwm_pin, GPIO.OUT)
        GPIO.setup(en1_pin, GPIO.OUT)
        GPIO.setup(en2_pin, GPIO.OUT)

        # initialise outputs
        GPIO.output(en1_pin, GPIO.LOW)
        GPIO.output(en2_pin, GPIO.LOW)

        # create motor pwm object as an argument for the running process
        motor_pwm = GPIO.PWM(self.pwm_pin, self.parameters['pwm_frequency'])

        run_arguments = {'motor_pwm': motor_pwm}

        super().__init__(motor_name, run_arguments, multiprocessing_manager)

    def get_pins(self):
        pins = {'pwm_pin': self.pwm_pin, 'en1_pin': self.en1_pin, 'en2_pin': self.en2_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def run(self, is_running, run_arguments, tracked_parameters):
        # determine pwm duty cycle, pwm frequency, direction, enable
        pwm_duty_cycle_value = utilities.bind_pwm_duty_cycle(self.parameters['pwm_duty_cycle'])

        pwm_frequency_value = utilities.bind_pwm_frequency(self.parameters['pwm_frequency'])

        print(f"{self.motor_name}.pwm_duty_cycle = {pwm_duty_cycle_value}, pwm_frequency = {pwm_frequency_value}")

        en1_value = GPIO.HIGH if self.parameters['direction'] == 0 else GPIO.LOW
        en2_value = GPIO.HIGH if self.parameters['direction'] == 1 else GPIO.LOW
        print(f"{self.motor_name}.direction = {self.parameters['direction']}, en1 = {en1_value}, en2 = {en2_value}")

        enable = self.parameters['enable'] == 1
        print(f"{self.motor_name}.enable = {enable}")

        duration_value = self.parameters['duration']
        print(f"{self.motor_name}.duration = {duration_value}")

        # run only if enabled
        if enable:
            # set the direction output via en1 and en2
            GPIO.output(self.en1_pin, en1_value)
            GPIO.output(self.en2_pin, en2_value)

            motor_pwm = run_arguments['motor_pwm']
            # start pwm
            motor_pwm.start(0)
            # change the pwm_frequency
            motor_pwm.ChangeFrequency(pwm_frequency_value)

            sleep(0.1) # pause due to a possible change in direction

            # actual running by gradually increasing pwm duty cycle from 0
            for i in range(pwm_duty_cycle_value + 1):
                motor_pwm.ChangeDutyCycle(i)
                sleep(0.005)

            # run duration
            sleep(duration_value)

            # stop the motor as it finished running the required duration
            self.stop_running(run_arguments)

        super().run(is_running)

    def stop_running(self, run_arguments):
        # stop the motor
        motor_pwm = run_arguments['motor_pwm']
        motor_pwm.ChangeDutyCycle(0)

        # set en1 and en2 to low
        GPIO.output(self.en1_pin, GPIO.LOW)
        GPIO.output(self.en2_pin, GPIO.LOW)

        # stop pwm
        motor_pwm.stop()

        sleep(0.5) # pause for a while
