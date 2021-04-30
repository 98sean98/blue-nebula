from time import sleep, time
import RPi.GPIO as GPIO
from multiprocessing import Manager, Process, Value
from ctypes import c_double

from lib.control_entities.bldc_motor import BLDCMotor

speed_pin = 1
pole_number = 4
gear_ratio = 1 / 66

def read_speed(speed):
    edge_counter = 0
    debounce_time = time()
    debounce_interval = 1

    last_i = 0

    while True:
        i = GPIO.input(speed_pin)

        if i == 1 and last_i != i:
            edge_counter += 1

        last_i = i

        duration = time() - debounce_time

        if duration >= debounce_interval:
            rpm = (edge_counter / duration) / pole_number * 20 * gear_ratio
            speed.value = round(rpm, 2)
            edge_counter = 0
            debounce_time = time()

        sleep(0.0003)

def main():
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(speed_pin, GPIO.IN)

    manager = Manager()

    bldc_motor = BLDCMotor('bldc_motor', 13, 6, 5, 0, manager)

    bldc_motor.set_parameters({
        'pwm_duty_cycle': 100,
        'pwm_frequency': 1000,
        'direction': 1,
        'enable': 1,
        'brake': 0,
        'duration': 300
    })

    sleep(1)

    bldc_speed = Value(c_double, 0.0)

    speed_reading = Process(target = read_speed, args = [bldc_speed])

    try:
        bldc_motor.set_is_running(True)

        speed_reading.start()

        while True:
            print('bldc speed:', bldc_speed.value)

            sleep(1)


    except KeyboardInterrupt:
        bldc_motor.set_is_running(False)
        speed_reading.terminate()
        speed_reading.join()

        GPIO.cleanup()

if __name__ == '__main__':
    main()
