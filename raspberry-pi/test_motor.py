from time import sleep, time

from motor import Motor

class TestMotor(Motor):
    def __init__(self, motor_name, multiprocessing_manager):
        super().__init__(motor_name, multiprocessing_manager, {'duration': 0})

    def run(self, tracked_parameters):
        start = time()

        while True:
            duration = round(time() - start, 1)
            tracked_parameters['duration'] = duration
            sleep(0.25)

    def get_tracked_parameters(self):
        return self.tracked_parameters
