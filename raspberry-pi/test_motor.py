from lib.control_entities.bldc_motor import BLDCMotor
from multiprocessing import Manager
import RPi.GPIO as GPIO

def main():
    GPIO.setmode(GPIO.BCM)
    multiprocessing_manager = Manager()

    bldc_motor = BLDCMotor('bldc_motor', 13, 6, 5, 0, multiprocessing_manager, {
        'pwm_duty_cycle': 100,
        'pwm_frequency': 1000,
        'direction': 0,
        'enable': 1,
        'brake': 0,
        'duration': 10
    })

    user_prompt = input('Enter command: ')

    while user_prompt != '0':
        is_running = user_prompt == '1'
        bldc_motor.set_is_running(is_running)
        user_prompt = input('Enter new command: ')

    print('exit')

if __name__ == '__main__':
    main()
