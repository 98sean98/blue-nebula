import os
from importlib import import_module

class MicroApp:
    def __init__(self):
        # get the micro app name from the env; defaults to "sample"
        micro_app_name = os.getenv('MICRO_APP_NAME', 'sample')

        # use the micro app name to import the module
        module_name = f".{micro_app_name}"

        module = import_module(module_name, package = __package__)
        get_control_entities = getattr(module, 'get_control_entities')

        self.get_control_entities = get_control_entities

    def get_control_entities(self, multiprocessing_manager):
        return self.get_control_entities(multiprocessing_manager)
