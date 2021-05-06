from time import sleep, time
import RPi.GPIO as GPIO

from .motor import Motor

from .. import utilities

class BLDCMotor(Motor):
    '''A brushless dc motor instance connected to the device'''

    # class attribute: list of parameters (order is important)
    parameters_keys = ['pwm_duty_cycle', 'pwm_frequency', 'direction', 'enable', 'brake', 'duration']
    # class attribute: list of tracked parameters (order is important)
    tracked_parameters_keys = ['speed_rpm', 'running_duration']

    def __init__(self, motor_name, pwm_pin, direction_pin, enable_pin, brake_pin, speed_pin, pairs_of_poles, gear_ratio, sampling_interval, multiprocessing_manager = None, initial_parameters = None):
        # pins
        self.pwm_pin = pwm_pin
        self.direction_pin = direction_pin
        self.enable_pin = enable_pin
        self.brake_pin = brake_pin
        self.speed_pin = speed_pin

        # hardware parameters
        self.pairs_of_poles = pairs_of_poles # example of 8 poles: 4 pairs of poles
        self.gear_ratio = gear_ratio # example of speed reducing gear: 1 / 66, for a 66 times speed reduction
        self.sampling_interval = sampling_interval

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
        GPIO.setup(speed_pin, GPIO.IN)

        # initialise enable, and brake outputs
        GPIO.output(enable_pin, GPIO.HIGH)
        GPIO.output(brake_pin, GPIO.HIGH)

        # create motor pwm object as an argument for the running process
        motor_pwm = GPIO.PWM(self.pwm_pin, self.parameters['pwm_frequency'])

        run_arguments = {'motor_pwm': motor_pwm}
        initial_tracked_parameters = {'speed_rpm': 0}

        super().__init__(motor_name, run_arguments, multiprocessing_manager, initial_tracked_parameters)

    def get_pins(self):
        pins = {'pwm_pin': self.pwm_pin, 'direction_pin': self.direction_pin, 'enable_pin': self.enable_pin, 'brake_pin': self.brake_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def run(self, is_running, run_arguments, tracked_parameters):
        # determine pwm duty cycle, pwm frequency, direction, enable, brake, duration
        pwm_duty_cycle_value = utilities.bind_pwm_duty_cycle(self.parameters['pwm_duty_cycle'])

        pwm_frequency_value = utilities.bind_pwm_frequency(self.parameters['pwm_frequency'])

        print(f"{self.motor_name}.pwm_duty_cycle = {pwm_duty_cycle_value}, pwm_frequency = {pwm_frequency_value}")

        direction_value = GPIO.LOW if self.parameters['direction'] == 0 else GPIO.HIGH
        print(f"{self.motor_name}.direction = {direction_value}")

        enable_value = GPIO.HIGH if self.parameters['enable'] == 0 else GPIO.LOW
        print(f"{self.motor_name}.enable = {enable_value}")

        duration_value = self.parameters['duration']
        print(f"{self.motor_name}.duration = {duration_value}")

        # set the direction output
        GPIO.output(self.direction_pin, direction_value)
        # set the enable output
        GPIO.output(self.enable_pin, enable_value)
        # set the brake output to LOW to allow motor operation
        GPIO.output(self.brake_pin, GPIO.LOW)

        motor_pwm = run_arguments['motor_pwm']
        # start pwm
        motor_pwm.start(0)
        # change the frequency
        motor_pwm.ChangeFrequency(pwm_frequency_value)

        sleep(0.1) # pause due to a possible change in direction

        # actual running by gradually increasing pwm duty cycle from 0
        for i in range(pwm_duty_cycle_value + 1):
            motor_pwm.ChangeDutyCycle(i)
            sleep(0.025)

        # during the run duration, track the speed
        start_time = time()
        pulse_counter = 0
        debounce_time = time()
        debounce_interval = 1
        i = 0
        last_i = 0
        while time() - start_time < duration_value:
            i = GPIO.input(self.speed_pin)
            if i == 1 and last_i != i: pulse_counter += 1
            last_i = i
            duration = time() - debounce_time
            if duration >= debounce_interval:
                rpm = (pulse_counter / duration) / self.pairs_of_poles * 20 * self.gear_ratio
                tracked_parameters['speed_rpm'] = round(rpm, 2)
                pulse_counter = 0
                debounce_time = time()
            sleep(self.sampling_interval)

        # reset the tracked speed to 0
        tracked_parameters['speed_rpm'] = 0

        # stop the motor as it finished running the required duration
        self.stop_running(run_arguments)

        # call parent method to finish running
        super().run(is_running)

    def stop_running(self, run_arguments):
        # stop the motor based on whether sudden braking is required
        sudden_brake = self.parameters['brake'] == 1

        motor_pwm = run_arguments['motor_pwm']

        motor_pwm.ChangeDutyCycle(0)
        if sudden_brake:
            GPIO.output(self.brake_pin, GPIO.HIGH)
        else:
            GPIO.output(self.enable_pin, GPIO.HIGH)

        # stop pwm
        motor_pwm.stop()

        sleep(0.5) # pause for a while
