from subprocess import check_output
import re

from ..bluetooth.service import Characteristic, Descriptor

from ..config.bluetooth_config import BluetoothConfig

from .. import utilities

CHARACTERISTIC_UUID = BluetoothConfig.UUID['ip_address']

def check_if_ip_address(string):
    regex = re.compile('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
    match = regex.match(string)
    return match is not None

class IPAddressCharacteristic(Characteristic):
    def __init__(self, service):
        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read"], service)
        self.add_descriptor(IPAddressDescriptor(self))

    def ReadValue(self, options):
        ip_address = self.get_ip_address()
        if ip_address is not None:
            print(f"read ip address: {ip_address}")
            return utilities.encode_base64(ip_address)
        else: return utilities.encode_base64('error')

    def get_ip_address(self):
        try:
            ip_address = check_output(['hostname', '-I'], encoding='UTF-8')
            if check_if_ip_address(ip_address): return ip_address
            else:
                string = check_output(['ifconfig', 'wlan0'], encoding='UTF-8')
                regex = re.compile('inet ((\d+\.){3}\d+)')
                ip_address = regex.search(string).group(1)
                if check_if_ip_address(ip_address): return ip_address
                else: raise Exception()
        except:
            print('Error: cannot find a valid ip address')

class IPAddressDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Non-static IP address for ssh"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
