import json
import time
from pprint import pprint
import os

# make the requests to enrichr using requests 
def main():

	f = open('crowdsourced_diseases_top600.gmt', 'r')
	
	for x in range(0,600):

		output = {};
		for i in range( (x * 20) + 0 , (x * 20) + 20):
			print i
			curr_line = f.readline()
			fields = curr_line.split('\t')
			output[fields[0]] = fields[2:len(fields)]

		with open(str(x) + '.json', 'w') as outfile:
			json.dump(output, outfile)

		# wf = open(str(x) + '.json', 'w')
		# wf.write(output)
		# wf.close()
# 	low_threshold = 3
# 	high_threshold = 50

# 	for i in range(0, len(names)):
# 		with open(names[i] + '.json') as data_file:    
# 			data = json.load(data_file)

# 		counter = 0;

# 		for key in data.keys():
# 			if (len(data[key]) < low_threshold):
# 				counter = counter + 1
# 			elif (len(data[key]) > high_threshold):
# 				counter = 3
# 		if (counter > 2):
# 			print 'removed a '+ names[i] 
# 			# print names[i] + '.json'
# 			os.remove(names[i] + '.json')
# # run main
main()