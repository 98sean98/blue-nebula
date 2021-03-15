from time import sleep
import RPi.GPIO as GPIO
from multiprocessing import Process

PWM = 13
DIR = 6
EN = 5
BRK = 0

GPIO.setmode(GPIO.BCM)

GPIO.setup(PWM, GPIO.OUT)
motor_pwm = GPIO.PWM(PWM, 1000)
motor_pwm.start(0)

GPIO.setup(DIR, GPIO.OUT)
GPIO.setup(EN, GPIO.OUT)
GPIO.setup(BRK, GPIO.OUT)

GPIO.output(BRK, GPIO.LOW)

sudden_brake = 0

def forward(motor_pwm, pwm_duty_cycle, duration):
    GPIO.output(DIR, GPIO.LOW)
    GPIO.output(EN, GPIO.LOW)
    GPIO.output(BRK, GPIO.LOW)

    sleep(0.1)

    duty_cycle = 0
    if pwm_duty_cycle < 0: duty_cycle = 0
    elif pwm_duty_cycle > 100: duty_cycle = 100
    else: duty_cycle = pwm_duty_cycle

    for i in range(duty_cycle + 1):
        motor_pwm.ChangeDutyCycle(i)
        sleep(0.005)

    sleep(duration)

    stop(motor_pwm)

def backward(motor_pwm, pwm_duty_cycle, duration):
    GPIO.output(DIR, GPIO.HIGH)
    GPIO.output(EN, GPIO.LOW)
    GPIO.output(BRK, GPIO.LOW)

    sleep(0.1)

    duty_cycle = 0
    if pwm_duty_cycle < 0: duty_cycle = 0
    elif pwm_duty_cycle > 100: duty_cycle = 100
    else: duty_cycle = pwm_duty_cycle

    for i in range(duty_cycle + 1):
        motor_pwm.ChangeDutyCycle(i)
        sleep(0.005)

    sleep(duration)

    stop(motor_pwm)

def stop(motor_pwm):
    motor_pwm.ChangeDutyCycle(0)
    if sudden_brake: GPIO.output(BRK, GPIO.HIGH)
    else: GPIO.output(EN, GPIO.HIGH)

def run_cycle(motor_pwm, cycles):
    print("started running all cycles")
    for i in range(cycles):
        print(f"started running the {i}-th cycle")
        forward(motor_pwm, 100, 5)
        sleep(0.5)
        backward(motor_pwm, 50, 5)
        sleep(1)
        print(f"finished running the {i}-th cycle")

    print("finished running all cycles, yay!")

if __name__ == '__main__':
    try:
        run_cycle(motor_pwm, 10)
    except KeyboardInterrupt:
        stop(motor_pwm)
        GPIO.cleanup()
    # p = Process(target=run_cycle, args=[10])
    # p.start()
    # while p.is_alive():
    #     print('still running')
    #     sleep(2)
    # p.join()
    # print('exit')
