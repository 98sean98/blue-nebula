from multiprocessing import Process
from time import sleep, time

from motor import Motor

p = Process(target=sleep, args=(60,))
p.start()

motor = Motor('motor')

while p.is_alive():
    user_prompt = input('Enter command: ')
    is_running = user_prompt == '1'
    motor.set_is_running(is_running)

motor.terminate_process()
p.join()

print('Exit')
