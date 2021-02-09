from multiprocessing import Process, Manager
from time import sleep, time
# import RPi.GPIO as GPIO

# from stepper_motor import StepperMotor
from test_motor import TestMotor

# GPIO.setmode(GPIO.BCM)

def sleep_with_duration(sleep_duration, parameter):
    for i in range(sleep_duration):
        parameter['sleep'] = i
        sleep(1)

def main():
    manager = Manager()
    parameter = manager.dict({'sleep': 0})
    p = Process(target=sleep_with_duration, args=(180, parameter))
    p.start()

    motor = TestMotor('motor', manager)

    while p.is_alive():
        user_prompt = input('Enter command: ')
        if user_prompt == '0': break
        is_running = user_prompt == '1'
        motor.set_is_running(is_running)
        print(motor.get_tracked_parameters())
        print(parameter)

    motor.terminate_process()
    if p.is_alive(): p.terminate()
    p.join()

    print('Exit')

if __name__ == '__main__':
    main()
