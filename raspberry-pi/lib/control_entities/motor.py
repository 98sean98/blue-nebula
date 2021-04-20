from .generic_control_entity import GenericControlEntity

class Motor(GenericControlEntity):
    '''A generic motor connected to the device, based on the generic control entity'''

    def __init__(self, motor_name, run_arguments = None, multiprocessing_manager = None, initial_tracked_parameters = None):
        self.motor_name = motor_name

        super().__init__(motor_name, run_arguments, multiprocessing_manager, initial_tracked_parameters)
