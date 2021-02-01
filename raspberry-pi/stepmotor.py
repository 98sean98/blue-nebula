from motor import Motor

class StepMotor(Motor):
    '''A step motor instance connected to the device'''

    # parameters (order of the dictionary keys is important)
    parameters = {
        'pulse_interval': 0,
        'degree': 0,
        'direction': 0, # 0 is LOW, 1 is HIGH
        'enable': 0 # 0 is LOW, 1 is HIGH
    }

    def __init__(self, motor_name, direction_pin, step_pin, enable_pin):
        self.motor_name = motor_name
        # pins
        self.direction_pin = direction_pin
        self.step_pin = step_pin
        self.enable_pin = enable_pin
        super().__init__(motor_name)

    def get_pins(self):
        pins = {'direction_pin': self.direction_pin, 'step_pin': self.step_pin, 'enable_pin': self.enable_pin}
        return pins

    def set_parameters(self, parameters):
        self.parameters = parameters

    def get_parameters(self):
        return self.parameters

    def set_gpio(self):
        # todo

        super().set_gpio()
