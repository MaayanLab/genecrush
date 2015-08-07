

def main():
	output = ""

	with open('example.txt') as f:
		for line in f:
			output += line[:-1] + ', '

	fh = open("output.txt","w")
	fh.write(output)
	fh.close()


main()