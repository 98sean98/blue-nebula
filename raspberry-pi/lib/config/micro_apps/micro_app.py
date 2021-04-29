import os

class MicroApp:
    def __init__(self, multiprocessing_manager):
        # get the micro app name from the env; defaults to "sample"
        micro_app_name = os.getenv('MICRO_APP_NAME', 'sample')

        # use the micro app name to import the module
        module_name = micro_app_name

        module = __import__(module_name)
        get_control_entities = getattr(module, 'get_control_entities')

        self.get_control_entities = get_control_entities
        self.multiprocessing_manager = multiprocessing_manager

    def get_control_entities(self):
        return self.get_control_entities(self.multiprocessing_manager)
