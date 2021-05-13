from multiprocessing import Process, Value
from ctypes import c_bool, c_double
from time import sleep, time

class GenericControlEntity:
    '''A generic control entity connected to the device.'''

    tracked_parameters_keys = ['running_duration']

    def __init__(self, name, run_arguments = None, multiprocessing_manager = None, initial_tracked_parameters = None):
        self.name = name

        self.is_running = Value(c_bool, False)
        self.running_duration = Value(c_double, 0.0)

        self.processes = []

        self.run_arguments = run_arguments

        if multiprocessing_manager is not None and initial_tracked_parameters is not None:
            self.tracked_parameters = multiprocessing_manager.dict(initial_tracked_parameters)
            self.initial_tracked_parameters = initial_tracked_parameters
        else:
            self.tracked_parameters = None
            self.initial_tracked_parameters = None

    def get_is_running(self):
        return self.is_running.value

    def set_is_running(self, is_running):
        if type(is_running) is not bool:
            print(f"is_running is not a boolean, {self.name} control is not changed")
        elif is_running == self.is_running.value:
            print(f"is_running is the same as before, {self.name} control is not changed")
        else:
            self.is_running.value = is_running
            print(f"{self.name} control has been changed, is_running is now {is_running}")

            # terminate the processes if they are alive
            self.terminate_processes()

            if is_running:
                # reset the tracked parameters
                self.reset_running_parameters()
                # spawn new processes
                self.spawn_processes()

    def spawn_processes(self):
        main = Process(target=self.run, args=[self.is_running, self.run_arguments, self.tracked_parameters])
        duration = Process(target=self.track_running_duration, args=[self.running_duration])
        main.start()
        duration.start()
        self.processes = [main, duration]

    def terminate_processes(self):
        self.stop_running(self.run_arguments)
        for p in self.processes:
            if p.is_alive():
                p.terminate()
                p.join()
        self.processes = []

    def reset_running_parameters(self):
        # reset tracked parameters if initial tracked parameters exist
        if self.initial_tracked_parameters is not None and self.tracked_parameters is not None:
            for [key, value] in list(self.initial_tracked_parameters.items()):
                self.tracked_parameters[key] = value
        # reset running duration
        self.running_duration.value = 0.0

    def run(self, is_running, run_arguments = None, tracked_parameters = None):
        is_running.value = False
        print(f"{self.name} has finished running!")

    def stop_running(self, run_arguments = None):
        pass

    def get_tracked_parameters(self):
        all_tracked_parameters = self.tracked_parameters if self.tracked_parameters is not None else {}
        all_tracked_parameters['running_duration'] = self.get_running_duration()
        return all_tracked_parameters

    def track_running_duration(self, running_duration):
        start_time = time()
        while True:
            running_duration.value = round(time() - start_time, 2)
            sleep(0.2)

    def get_running_duration(self):
        return self.running_duration.value
