import json
import time
from pprint import pprint
import os

# make the requests to enrichr using requests 
def main():

	names = ["Achilles_fitness_decrease", "Achilles_fitness_increase", "Allen_Brain_Atlas_down", "Allen_Brain_Atlas_up", "BioCarta_2015", "Cancer_Cell_Line_Encyclopedia", "ChEA", "Chromosome_Location", "CMAP_down", "CMAP_up", "CORUM", "Cross_Species_Phenotype", "Disease_Signatures_from_GEO_down", "Disease_Signatures_from_GEO_up", "Drug_Perturbations_from_GEO", "ENCODE_Histone_Modifications_2013", "ENCODE_Histone_Modifications_2015", "ENCODE_TF_ChIP-seq", "ENCODE_TF_ChIP-seq_2015", "Epigenomics_Roadmap_HM_ChIP-seq", "ESCAPE", "GeneSigDB", "Genome_Browser_PWMs", "GO_Biological_Process", "GO_Biological_Process_2013", "GO_Cellular_Component", "GO_Cellular_Component_2013", "GO_Molecular_Function", "GO_Molecular_Function_2013", "HMDB_Metabolites", "HomoloGene", "Human_Gene_Atlas", "Human_Phenotype_Ontology", "HumanCyc", "KEA", "KEGG_2013", "KEGG_2015", "Kinase_Perturbations_from_GEO", "Kinase_Perturbations_from_L1000", "MGI_Mammalian_Phenotype", "MGI_Mammalian_Phenotype_Level_3", "MGI_Mammalian_Phenotype_Level_4", "Mouse_Gene_Atlas", "MSigDB_Computational", "MSigDB_Oncogenic_Signatures", "NCI-60_Cancer_Cell_Lines", "NCI-Nature", "NURSA_Human_Endogenous_Complexome", "OMIM_Disease", "OMIM_Expanded", "Panther", "Pfam_InterPro_Domains", "Phosphatase_Substrates_from_DEPOD", "PPI_Hub_Proteins", "Reactome", "Reactome_2015", "SILAC_Phosphoproteomics", "TargetScan_microRNA", "TF-LOF_Expression_from_GEO", "Tissue_Protein_Expression_from_Human_Proteome_Map", "Tissue_Protein_Expression_from_ProteomicsDB", "Transcription_Factor_PPIs", "TRANSFAC_and_JASPAR_PWMs", "Virus_Perturbations_from_GEO_down", "Virus_Perturbations_from_GEO_up", "VirusMINT", "WikiPathways", "WikiPathways_2015"]
	
	low_threshold = 3
	high_threshold = 50

	list_of_file_names = []

	for i in range(0, 6479):
		with open(str(i) + '_.json') as data_file:    
			data = json.load(data_file)

		counter = 0;

		for key in data.keys():
			if (len(data[key]) < low_threshold):
				counter = counter + 1
			elif (len(data[key]) > high_threshold):
				counter = 3
		if (counter > 2):
			print 'removed a '+ str(i) 
			# print names[i] + '.json'
			os.remove(str(i) + '_.json')
		else :
			list_of_file_names.append(i)

	print list_of_file_names
# run main
main()