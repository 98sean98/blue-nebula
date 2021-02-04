from multiprocessing import Process
from time import sleep, time

from stepper_example import run_cycle

p = Process(target=run_cycle, args=(5,))
p.start()

procs = [p]

TIMEOUT = 5
start = time()
while time() - start <= TIMEOUT:
    if not any(p.is_alive() for p in procs):
        # All the processes are done, break now.
        break

    sleep(.1)  # Just to avoid hogging the CPU
else:
    # We only enter this if we didn't 'break' above.
    print("timed out, killing all processes")
    for p in procs:
        p.terminate()
        p.join()

print('Exit')
