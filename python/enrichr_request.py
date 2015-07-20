import json
import time

# make the requests to enrichr using requests 
def main():

	# input genes
	input_genes = ["Nsun3", "Polrmt", "Nlrx1", "Sfxn5", "Zc3h12c", "Slc25a39", "Arsg", "Defb29", "Ndufb6", "Zfand1", "Tmem77", "5730403B10Rik", "RP23-195K8.6", "Tlcd1", "Psmc6", "Slc30a6", "LOC100047292", "Lrrc40", "Orc5l", "Mpp7", "Unc119b", "Prkaca", "Tcn2", "Psmc3ip", "Pcmtd2", "Acaa1a", "Lrrc1", "2810432D09Rik", "Sephs2", "Sac3d1", "Tmlhe", "LOC623451", "Tsr2", "Plekha7", "Gys2", "Arhgef12", "Hibch", "Lyrm2", "Zbtb44", "Entpd5", "Rab11fip2", "Lipt1", "Intu", "Anxa13", "Klf12", "Sat2", "Gal3st2", "Vamp8", "Fkbpl", "Aqp11", "Trap1", "Pmpcb", "Tm7sf3", "Rbm39", "Bri3", "Kdr", "Zfp748", "Nap1l1", "Dhrs1", "Lrrc56", "Wdr20a", "Stxbp2", "Klf1", "Ufc1", "Ccdc16", "9230114K14Rik", "Rwdd3", "2610528K11Rik", "Aco1", "Cables1", "LOC100047214", "Yars2", "Lypla1", "Kalrn", "Gyk", "Zfp787", "Zfp655", "Rabepk", "Zfp650", "4732466D17Rik", "Exosc4", "Wdr42a", "Gphn", "2610528J11Rik", "1110003E01Rik", "Mdh1", "1200014M14Rik", "AW209491", "Mut", "1700123L14Rik", "2610036D13Rik", "Cox15", "Tmem30a", "Nsmce4a", "Tm2d2", "Rhbdd3", "Atxn2", "Nfs1", "3110001I20Rik", "BC038156", "LOC100047782", "2410012H22Rik", "Rilp", "A230062G08Rik", "Pttg1ip", "Rab1", "Afap1l1", "Lyrm5", "2310026E23Rik", "C330002I19Rik", "Zfyve20", "Poli", "Tomm70a", "Slc7a6os", "Mat2b", "4932438A13Rik", "Lrrc8a", "Smo", "Nupl2", "Trpc2", "Arsk", "D630023B12Rik", "Mtfr1", "5730414N17Rik", "Scp2", "Zrsr1", "Nol7", "C330018D20Rik", "Ift122", "LOC100046168", "D730039F16Rik", "Scyl1", "1700023B02Rik", "1700034H14Rik", "Fbxo8", "Paip1", "Tmem186", "Atpaf1", "LOC100046254", "LOC100047604", "Coq10a", "Fn3k", "Sipa1l1", "Slc25a16", "Slc25a40", "Rps6ka5", "Trim37", "Lrrc61", "Abhd3", "Gbe1", "Parp16", "Hsd3b2", "Esm1", "Dnajc18", "Dolpp1", "Lass2", "Wdr34", "Rfesd", "Cacnb4", "2310042D19Rik", "Srr", "Bpnt1", "6530415H11Rik", "Clcc1", "Tfb1m", "4632404H12Rik", "D4Bwg0951e", "Med14", "Adhfe1", "Thtpa", "Cat", "Ell3", "Akr7a5", "Mtmr14", "Timm44", "Sf1", "Ipp", "Iah1", "Trim23", "Wdr89", "Gstz1", "Cradd", "2510006D16Rik", "Fbxl6", "LOC100044400", "Zfp106", "Cd55", "0610013E23Rik", "Afmid", "Tmem86a", "Aldh6a1", "Dalrd3", "Smyd4", "Nme7", "Fars2", "Tasp1", "Cldn10", "A930005H10Rik", "Slc9a6", "Adk", "Rbks", "2210016F16Rik", "Vwce", "4732435N03Rik", "Zfp11", "Vldlr", "9630013D21Rik", "4933407N01Rik", "Fahd1", "Mipol1", "1810019D21Rik", "1810049H13Rik", "Tfam", "Paics", "1110032A03Rik", "LOC100044139", "Dnajc19", "BC016495", "A930041I02Rik", "Rqcd1", "Usp34", "Zcchc3", "H2afj", "Phf7", "4921508D12Rik", "Kmo", "Prpf18", "Mcat", "Txndc4", "4921530L18Rik", "Vps13b", "Scrn3", "Tor1a", "AI316807", "Acbd4", "Fah", "Apool", "Col4a4", "Lrrc19", "Gnmt", "Nr3c1", "Sip1", "Ascc1", "Fech", "Abhd14a", "Arhgap18", "2700046G09Rik", "Yme1l1", "Gk5", "Glo1", "Sbk1", "Cisd1", "2210011C24Rik", "Nxt2", "Notum", "Ankrd42", "Ube2e1", "Ndufv1", "Slc33a1", "Cep68", "Rps6kb1", "Hyi", "Aldh1a3", "Mynn", "3110048L19Rik", "Rdh14", "Proz", "Gorasp1", "LOC674449", "Zfp775", "5430437P03Rik", "Npy", "Adh5", "Sybl1", "4930432O21Rik", "Nat9", "LOC100048387", "Mettl8", "Eny2", "2410018G20Rik", "Pgm2", "Fgfr4", "Mobkl2b", "Atad3a", "4932432K03Rik", "Dhtkd1", "Ubox5", "A530050D06Rik", "Zdhhc5", "Mgat1", "Nudt6", "Tpmt", "Wbscr18", "LOC100041586", "Cdk5rap1", "4833426J09Rik", "Myo6", "Cpt1a", "Gadd45gip1", "Tmbim4", "2010309E21Rik", "Asb9", "2610019F03Rik", "7530414M10Rik", "Atp6v1b2", "2310068J16Rik", "Ddt", "Klhdc4", "Hpn", "Lifr", "Ovol1", "Nudt12", "Cdan1", "Fbxo9", "Fbxl3", "Hoxa7", "Aldh8a1", "3110057O12Rik", "Abhd11", "Psmb1", "ENSMUSG00000074286", "Chpt1", "Oxsm", "2310009A05Rik", "1700001L05Rik", "Zfp148", "39509", "Mrpl9", "Tmem80", "9030420J04Rik", "Naglu", "Plscr2", "Agbl3", "Pex1", "Cno", "Neo1", "Asf1a", "Tnfsf5ip1", "Pkig", "AI931714", "D130020L05Rik", "Cntd1", "Clec2h", "Zkscan1", "1810044D09Rik", "Mettl7a", "Siae", "Fbxo3", "Fzd5", "Tmem166", "Tmed4", "Gpr155", "Rnf167", "Sptlc1", "Riok2", "Tgds", "Pms1", "Pitpnc1", "Pcsk7", "4933403G14Rik", "Ei24", "Crebl2", "Tln1", "Mrpl35", "2700038C09Rik", "Ubie", "Osgepl1", "2410166I05Rik", "Wdr24", "Ap4s1", "Lrrc44", "B3bp", "Itfg1", "Dmxl1", "C1d"];

	names = ["Achilles_fitness_decrease", "Achilles_fitness_increase", "Allen_Brain_Atlas_down", "Allen_Brain_Atlas_up", "BioCarta_2015", "Cancer_Cell_Line_Encyclopedia", "ChEA", "Chromosome_Location", "CMAP_down", "CMAP_up", "CORUM", "Cross_Species_Phenotype", "Disease_Signatures_from_GEO_down", "Disease_Signatures_from_GEO_up", "Drug_Perturbations_from_GEO", "ENCODE_Histone_Modifications_2013", "ENCODE_Histone_Modifications_2015", "ENCODE_TF_ChIP-seq", "ENCODE_TF_ChIP-seq_2015", "Epigenomics_Roadmap_HM_ChIP-seq", "ESCAPE", "GeneSigDB", "Genome_Browser_PWMs", "GO_Biological_Process", "GO_Biological_Process_2013", "GO_Cellular_Component", "GO_Cellular_Component_2013", "GO_Molecular_Function", "GO_Molecular_Function_2013", "HMDB_Metabolites", "HomoloGene", "Human_Gene_Atlas", "Human_Phenotype_Ontology", "HumanCyc", "KEA", "KEGG_2013", "KEGG_2015", "Kinase_Perturbations_from_GEO", "Kinase_Perturbations_from_L1000", "MGI_Mammalian_Phenotype", "MGI_Mammalian_Phenotype_Level_3", "MGI_Mammalian_Phenotype_Level_4", "Mouse_Gene_Atlas", "MSigDB_Computational", "MSigDB_Oncogenic_Signatures", "NCI-60_Cancer_Cell_Lines", "NCI-Nature", "NURSA_Human_Endogenous_Complexome", "OMIM_Disease", "OMIM_Expanded", "Panther", "Pfam_InterPro_Domains", "Phosphatase_Substrates_from_DEPOD", "PPI_Hub_Proteins", "Reactome", "Reactome_2015", "SILAC_Phosphoproteomics", "TargetScan_microRNA", "TF-LOF_Expression_from_GEO", "Tissue_Protein_Expression_from_Human_Proteome_Map", "Tissue_Protein_Expression_from_ProteomicsDB", "Transcription_Factor_PPIs", "TRANSFAC_and_JASPAR_PWMs", "Virus_Perturbations_from_GEO_down", "Virus_Perturbations_from_GEO_up", "VirusMINT", "WikiPathways", "WikiPathways_2015"]

	transc_names = ['ChEA', 'TRANSFAC_and_JASPAR_PWMs', 'Epigenomics_Roadmap_HM_ChIP-seq', 'TargetScan_microRNA', 'ENCODE_TF_ChIP-seq_2015', 'ENCODE_Histone_Modifications_2015', 'Transcription_Factor_PPIs']
	

	for i in range(0, len(names)):
		ts = time.time()
		name = names[i]
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
		file = open(name+'.json', 'w+')
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