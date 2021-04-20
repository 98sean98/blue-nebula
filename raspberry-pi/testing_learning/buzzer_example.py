import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)

buzzer_pin = 25

GPIO.setup(buzzer_pin, GPIO.OUT)

sleep(1)

for i in range(3):
    GPIO.output(buzzer_pin, GPIO.HIGH)
    sleep(0.1)
    GPIO.output(buzzer_pin, GPIO.LOW)
    sleep(3)

GPIO.cleanup()
