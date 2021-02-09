from multiprocessing import Process, Value
from ctypes import c_bool
from time import sleep

class Motor:
    '''This is a generic motor connected to the device.'''

    is_running = Value(c_bool, False)

    process = None

    tracked_parameters = None

    def __init__(self, motor_name, multiprocessing_manager = None, initial_tracked_parameters = None):
        self.motor_name = motor_name
        if multiprocessing_manager is not None and initial_tracked_parameters is not None:
            self.tracked_parameters = multiprocessing_manager.dict(initial_tracked_parameters)

    def get_is_running(self):
        return self.is_running.value

    def set_is_running(self, is_running):
        if type(is_running) is not bool:
            print('is_running is not a boolean, motor control is not changed')
        elif is_running == self.is_running.value:
            print('is_running is the same as before, motor control is not changed')
        else:
            self.is_running.value = is_running
            print(f"{self.motor_name} control has been changed, is_running is now {is_running}")

            # terminate the process if it is alive
            self.terminate_process()

            if is_running:
                # spawn a new process
                self.spawn_process()
                # start the process
                self.process.start()

    def spawn_process(self):
        self.process = Process(target=self.run, args=[self.is_running, self.tracked_parameters])

    def terminate_process(self):
        self.stop_running()
        if (self.process is not None and self.process.is_alive()):
            self.process.terminate()
            self.process.join()

    def run(self, is_running, tracked_parameters):
        is_running.value = False

    def stop_running(self):
        pass
