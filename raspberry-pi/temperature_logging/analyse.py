import os
import sys
import pandas as pd

def read_log_file(log_file):
	df = pd.read_csv(log_file)

	for row in df.itertuples():
		if (float(row._2) >= 50):
			print(f"{row._1}, {row._2}")

def main():
	print(f"Reading logs")

	script_dir = os.path.dirname(__file__)
	rel_path = 'logs'
	abs_dir_path = os.path.join(script_dir, rel_path)

	for f in os.listdir(abs_dir_path):
		if (f[len(f) - 4:] == '.csv'):
			log_file = os.path.join(abs_dir_path, f)
			try:
				print(f"Reading {f}")
				read_log_file(log_file)
			except Exception:
				print(f"Cannot read {f} correctly")



if __name__ == "__main__":
	main()
