from multiprocessing import Process
from time import sleep, time
import RPi.GPIO as GPIO

from stepper_motor import StepperMotor

GPIO.setmode(GPIO.BCM)

p = Process(target=sleep, args=(180,))
p.start()

motor = StepperMotor('motor', 17, 27, 22)

motor.set_parameters({'pulse_interval': 300, 'degree': 250000, 'direction': 0, 'enable': 1})

while p.is_alive():
    user_prompt = input('Enter command: ')
    is_running = user_prompt == '1'
    motor.set_is_running(is_running)

motor.terminate_process()
p.join()

print('Exit')
