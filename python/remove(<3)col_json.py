import json
import time
from pprint import pprint
import os

# make the requests to enrichr using requests 
def main():

	names = ['ChEA', 'TRANSFAC_and_JASPAR_PWMs', 'Epigenomics_Roadmap_HM_ChIP-seq', 'TargetScan_microRNA', 'ENCODE_TF_ChIP-seq_2015', 'ENCODE_Histone_Modifications_2015', 'Transcription_Factor_PPIs']
	

	for i in range(0, len(names)):
		with open(names[i] + '.json') as data_file:    
			data = json.load(data_file)

		max = 0;

		for key in data.keys():
			if (len(data[key]) > max):
				max = len(data[key])

		if (max < 3):
			print 'removed a '+ names[i] 
			# print names[i] + '.json'
			os.remove(names[i] + '.json')
# run main
main()