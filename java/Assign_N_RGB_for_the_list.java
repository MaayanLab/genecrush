package Sorting;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Assign_N_RGB_for_the_list {

	public static void main(String[] args) throws IOException {
		Scanner s = new Scanner(new File("human_mouse_gene_symbols.txt"));
		List<String> names = new ArrayList<String>();

		// Read each line, ensuring correct format.
		while (s.hasNext())
		{
		    names.add(s.next()); // read and store 'name'
		}
		
		System.out.println(names.size());
		List<String> colors = new ArrayList<String>();
		int N = names.size();
		
		for(int i = 0; i<N; i++){
		  colors.add(spectrum(i/((double)(N-1))));
		}
		
		StringBuffer output = new StringBuffer();
		output.append("{\n");
		for (int i = 0; i < N; i++){
			output.append("\t\"");
			output.append(names.get(i) + "\":\"");
			output.append(colors.get(i) + "\"");
			if (i < (N-1)) {
				output.append(",");
			}
			output.append("\n");
		}
		output.append("}");
		String fileOutName = "human_mouse_gene_symbols(RGB).json";
		
		// Initialize new PrintWriter.
		PrintWriter out = new PrintWriter(new FileWriter(fileOutName));
		
		// Write String to the Print Writer
		out.print(output);
		out.close();
		System.out.println("success!");
	}
	
	private static String spectrum(double w) {
		if (w>1)w=1;
		if (w<0)w=0;

		w=w*(645-380)+380;
		double R,B,G;
		if (w >= 380 && w < 440){
		    R = -(w - 440.) /(440. - 350.);
		    G = 0.0;
		    B = 1.0;
		}
		else if (w >= 440 && w < 490){
		    R = 0.0;
		    G = (w - 440.) /(490. - 440.);
		    B = 1.0;
		}
		else if (w >= 490 && w < 510){
		    R = 0.0;
		    G = 1.0;
		    B = (510-w) /(510. - 490.);
		}
		else if (w >= 510 && w < 580){
		    R = (w - 510.) /(580. - 510.);
		    G = 1.0;
		    B = 0.0;
		}
		else if (w >= 580 && w < 645){
		    R = 1.0;
		    G = -(w - 645.) /(645. - 580.);
		    B = 0.0;
		}
		else if (w >= 645 && w <= 780){
		    R = 1.0;
		    G = 0.0;
		    B = 0.0;
		}
		else{
		    R = 0.0;
		    G = 0.0;
		    B = 0.0;
		}
		return "("+ ((int) Math.round(R * 255))
				+","+ ((int) (G * 255))
				+","+ ((int) (B * 255)) +")";

		}
	
}
