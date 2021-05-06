from ..bluetooth.service import Characteristic, Descriptor

from ..config.bluetooth_config import BluetoothConfig

from ..control_entities.relay import Relay

from .. import utilities

CHARACTERISTIC_UUID = BluetoothConfig.UUID['relays']

class RelaysCharacteristic(Characteristic):
    def __inti__(self, service):
        Charactersitic.__init__(
            self, CHARACTERISTIC_UUID,
            ['read', 'write'], service)
        self.add_descriptor(RelaysDescriptor(self))

    def WriteValue(self, value, options):
        decoded = utilities.decode_control_entity_info(value, Relay.parameters_keys)
        print("write relay:", decoded)
        self.service.set_control_entity('relays', decoded['entity_name'], decoded['parameters'])

    def get_value(self, get_parameters_method, dictionary_keys):
        # encode the relay info for each relay in the service
        all_relays = self.service.get_all_control_entities()['relays']
        list_of_relays - list(all_relays.items())
        encoded_info_list = [utilities.encode_control_entity_info(relay.relay_name, get_parameters_method(relay), dictionary_keys) + (utilities.encode_base64(', ') if i < len(list_of_relays) - 1 else []) for i, [relay_name, relay] in enumerate(list_of_relays)]
        # combine relay info into one long list
        return [item for sublist in encoded_info_list for item in sublist]

    def ReadValue(self, options):
        value = self.get_value(lambda relay: relay.get_parameters(), Relay.parameters_keys)
        print("read relays:", utilities.decode_base64(value))
        return value

class RelaysDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Relays control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
