import os
from time import sleep
from datetime import datetime
from gpiozero import CPUTemperature
import csv

def get_ct():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

try:
    script_dir = os.path.dirname(__file__)
    script_ct = get_ct()
    rel_path = f"logs/{script_ct}.csv"
    abs_file_path = os.path.join(script_dir, rel_path)

    while True:
        f = open(abs_file_path, 'a+')

        cpu = CPUTemperature()
        temperature = cpu.temperature

        print(f"cpu temp: {temperature}")

        ct = get_ct()

        file_writer = csv.writer(f, delimiter=',', quotechar='"')
        file_writer.writerow([ct, temperature])

        f.close()

        sleep(1)

except KeyboardInterrupt:
    print('keyboard interrupt exit!')
