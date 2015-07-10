package File;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

public class ProcessText2json {

	public static void main(String[] args) throws IOException {
//		String codeInName = "Phosphatase_Substrates_SAMPLE.txt";
		String codeInName = "Phosphatase_Substrates_from_DEPOD.txt";

		// calls the method
		String codeStr = readFile(codeInName, StandardCharsets.UTF_8);
		Scanner sc = new Scanner(codeStr);
		String output = "{\n";
		while(sc.hasNextLine()) {
			String line = sc.nextLine();
			Scanner lsc = new Scanner(line);
			String group = lsc.next();
			output += "\t\"" + group + "\":[\"";
			while(lsc.hasNext()) {
				output += lsc.next() + "\",\"";
			}
			output = output.substring(0, output.length()-2);
			output += "],\n";
			lsc.close();
		}
		output = output.substring(0, output.length()-2);
		output += "\n}";
		
		
		// OUTPUT
		String fileOutName = "Phosphatase_Substrates_from_DEPOD.json";
		
		//String to be wrote.
//		StringBuffer output = new StringBuffer();
//		output.append("This is testing purposes.");
		
		// Initialize new PrintWriter.
		PrintWriter out = new PrintWriter(new FileWriter(fileOutName));
		
		// Write String to the Print Writer
		out.print(output);
		out.close();
		sc.close();
		System.out.println("success!");
	}

	// Reads file in as a string.
	private static String readFile(String path, Charset encoding) throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, encoding);
	}
}
