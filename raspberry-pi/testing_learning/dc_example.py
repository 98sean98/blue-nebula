from time import sleep
import RPi.GPIO as GPIO
from multiprocessing import Process

PWM = 21
EN1 = 20
EN2 = 16

GPIO.setmode(GPIO.BCM)

GPIO.setup(PWM, GPIO.OUT)
motor_pwm = GPIO.PWM(PWM, 1000)

GPIO.setup(EN1, GPIO.OUT)
GPIO.setup(EN2, GPIO.OUT)

def forward(motor_pwm, pwm_duty_cycle, duration):
    GPIO.output(EN1, GPIO.HIGH)
    GPIO.output(EN2, GPIO.LOW)

    sleep(0.1)

    duty_cycle = 0
    if pwm_duty_cycle < 0: duty_cycle = 0
    elif pwm_duty_cycle > 100: duty_cycle = 100
    else: duty_cycle = pwm_duty_cycle

    motor_pwm.start(0)

    for i in range(duty_cycle + 1):
        motor_pwm.ChangeDutyCycle(i)
        sleep(0.005)

    sleep(duration)

    stop(motor_pwm)

def backward(motor_pwm, pwm_duty_cycle, duration):
    GPIO.output(EN1, GPIO.LOW)
    GPIO.output(EN2, GPIO.HIGH)

    sleep(0.1)

    motor_pwm.start(0)

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
    GPIO.output(EN1, GPIO.LOW)
    GPIO.output(EN2, GPIO.LOW)
    motor_pwm.stop()

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
        p = Process(target=run_cycle, args=[motor_pwm, 10])
        p.start()
        while p.is_alive():
            print('still running...')
            sleep(2)
        p.join()
        print('exit')
    except KeyboardInterrupt:
        stop(motor_pwm)
        GPIO.cleanup()
