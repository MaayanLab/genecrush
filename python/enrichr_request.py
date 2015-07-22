import json
import time

# make the requests to enrichr using requests 
def main():
	counter= 0;
	f = open('crowdsourced_diseases_top600.gmt', 'r')
	for z in range(0,600):
		curr_line = f.readline()
		fields = curr_line.split('\t')
		input_genes = fields[2:len(fields)]

		names = ["Achilles_fitness_decrease", "Achilles_fitness_increase", "Allen_Brain_Atlas_down", "Allen_Brain_Atlas_up", "BioCarta_2015", "Cancer_Cell_Line_Encyclopedia", "ChEA", "Chromosome_Location", "CMAP_down", "CMAP_up", "CORUM", "Cross_Species_Phenotype", "Disease_Signatures_from_GEO_down", "Disease_Signatures_from_GEO_up", "Drug_Perturbations_from_GEO", "ENCODE_Histone_Modifications_2013", "ENCODE_Histone_Modifications_2015", "ENCODE_TF_ChIP-seq", "ENCODE_TF_ChIP-seq_2015", "Epigenomics_Roadmap_HM_ChIP-seq", "ESCAPE", "GeneSigDB", "Genome_Browser_PWMs", "GO_Biological_Process", "GO_Biological_Process_2013", "GO_Cellular_Component", "GO_Cellular_Component_2013", "GO_Molecular_Function", "GO_Molecular_Function_2013", "HMDB_Metabolites", "HomoloGene", "Human_Gene_Atlas", "Human_Phenotype_Ontology", "HumanCyc", "KEA", "KEGG_2013", "KEGG_2015", "Kinase_Perturbations_from_GEO", "Kinase_Perturbations_from_L1000", "MGI_Mammalian_Phenotype", "MGI_Mammalian_Phenotype_Level_3", "MGI_Mammalian_Phenotype_Level_4", "Mouse_Gene_Atlas", "MSigDB_Computational", "MSigDB_Oncogenic_Signatures", "NCI-60_Cancer_Cell_Lines", "NCI-Nature", "NURSA_Human_Endogenous_Complexome", "OMIM_Disease", "OMIM_Expanded", "Panther", "Pfam_InterPro_Domains", "Phosphatase_Substrates_from_DEPOD", "PPI_Hub_Proteins", "Reactome", "Reactome_2015", "SILAC_Phosphoproteomics", "TargetScan_microRNA", "TF-LOF_Expression_from_GEO", "Tissue_Protein_Expression_from_Human_Proteome_Map", "Tissue_Protein_Expression_from_ProteomicsDB", "Transcription_Factor_PPIs", "TRANSFAC_and_JASPAR_PWMs", "Virus_Perturbations_from_GEO_down", "Virus_Perturbations_from_GEO_up", "VirusMINT", "WikiPathways", "WikiPathways_2015"]

		transc_names = ['ChEA', 'TRANSFAC_and_JASPAR_PWMs', 'Epigenomics_Roadmap_HM_ChIP-seq', 'TargetScan_microRNA', 'ENCODE_TF_ChIP-seq_2015', 'ENCODE_Histone_Modifications_2015', 'Transcription_Factor_PPIs']
		

		for i in range(0, len(transc_names)):
			ts = time.time()
			name = transc_names[i]
			print name
			# run request function 
			enr, userListId = enrichr_request(input_genes, '', name )

			twenty_terms = []
			twenty_genes = []
			if len(enr) > 20:
				for x in range(len(enr)-20, len(enr)) : 
					twenty_terms.append(enr[x][1])
					twenty_genes.append(enr[x][5])
				# twenty.get_response.text[0])
			else:
				for x in range(0, len(enr)) : 
					twenty_terms.append(enr[x][1])
					twenty_genes.append(enr[x][5])
			file = open(str(counter) +'.json', 'w+')
			counter = counter + 1
			result = {}
			if len(enr) > 20:
				for x in range(0, 20):
					key = twenty_terms[x]
					value = twenty_genes[x]
					result[key] = value
			else:
				for x in range(0, len(enr)):
					key = twenty_terms[x]
					value = twenty_genes[x]
					result[key] = value
			json_str = json.dumps(result)

			file.write(json_str)
			file.close

def enrichr_request( input_genes, meta='', gmt='' ):

  # get metadata 
	import requests
	import json

	# stringify list 
	input_genes = '\n'.join(input_genes)

	# define post url 
	post_url = 'http://amp.pharm.mssm.edu/Enrichr/addList'

	# define parameters 
	params = {'list':input_genes, 'description':''}

	# make request: post the gene list
	post_response = requests.post( post_url, files=params)

	# load json 
	inst_dict = json.loads( post_response.text )
	userListId = str(inst_dict['userListId'])

	print userListId

	# define the get url 
	get_url = 'http://amp.pharm.mssm.edu/Enrichr/enrich'

	# get parameters 
	params = {'backgroundType':gmt, 'userListId':userListId}
	for x in range(0,100000):
		print (gmt + " - " + str(x))
	# make the get request to get the enrichr results 
	get_response = requests.get( get_url, params=params )
	print(get_response)
	# load as dictionary 
	resp_json = json.loads( get_response.text )
	
	# get the key 
	only_key = resp_json.keys()[0]

	enr = resp_json[only_key]

	# return enrichment json and userListId
	return enr, userListId

def enrichr_result(genes, meta='', gmt=''):
	import cookielib, poster, urllib2, json
	import time

	global baseurl
	baseurl = 'amp.pharm.mssm.edu'
	# baseurl = 'matthews-mbp:8080'

	"""return the enrichment results for a specific gene-set library on Enrichr"""
	cj = cookielib.CookieJar()
	opener = poster.streaminghttp.register_openers()
	opener.add_handler(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
	genesStr = '\n'.join(genes)

	params = {'list':genesStr,'description':meta,'inputMethod':'enrichr_cluster'}
	datagen, headers = poster.encode.multipart_encode(params)
	url = "http://" + baseurl + "/Enrichr/enrich"
	request = urllib2.Request(url, datagen, headers)

	# wait for request 
	resp = urllib2.urlopen(request)

	# # print(resp.read())
	# time.sleep(2)

	# alternate wait for response
	# try:
	# 	resp = urllib2.urlopen(request)
	# 	print(resp.read())
	# except IOError as e:
	# 	pass

	x = urllib2.urlopen("http://" + baseurl + "/Enrichr/enrich?backgroundType=" + gmt)
	response = x.read()
	response_list = json.loads(response)
	return response_list[gmt]


# run main
main()