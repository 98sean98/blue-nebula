class StepMotor:
    '''A step motor instance connected to the device'''

    # parameters (order of the dictionary keys is important)
    parameters = {
        'pulse_interval': 0,
        'degree': 0,
        'direction': 0, # 0 is LOW, 1 is HIGH
        'enable': 0 # 0 is LOW, 1 is HIGH
    }

    # is running
    is_running = False

    def __init__(self, motor_name, direction_pin, step_pin, enable_pin):
        self.motor_name = motor_name
        # pins
        self.direction_pin = direction_pin
        self.step_pin = step_pin
        self.enable_pin = enable_pin

    def get_pins(self):
        pins = {'direction_pin': self.direction_pin, 'step_pin': self.step_pin, 'enable_pin': self.enable_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def set_is_running(self, is_running):
        if (type(is_running) is not bool):
            print('is_running is not a boolean, motor control is not changed.')
        elif (is_running == self.is_running):
            print('is_running is the same as before, motor control is not changed.')
        else:
            self.is_running = is_running

            # todo: set gpio pins

            print(f'motor control has been changed, is_running is now {is_running}')
