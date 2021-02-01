import bluetooth

print("This device's bluetooth address: {}".format(bluetooth.read_local_bdaddr()))

print("Finding nearby bluetooth devices...");

nearby_devices = bluetooth.discover_devices(duration=10, lookup_names=True, flush_cache=True, lookup_class=False)

print("Found {} devices".format(len(nearby_devices)))

for addr, name in nearby_devices:
    try:
        print("\t {} - {}".format(addr, name))
    except UnicodeEncodeError:
        print("\t {} - {}".format(addr, name.encode("utf-8", "replace")))

