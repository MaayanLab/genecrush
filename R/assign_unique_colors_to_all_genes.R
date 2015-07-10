getwd();
setwd("~/../../Applications/XAMPP/htdocs/2015.06.19.enrichr.game/R");
genes <- read.table("human_mouse_gene_symbols.txt", sep="\t", header = F)

new_genes <- NULL
for (i in 1:90079) {
   if (nchar(toString(genes[[1]][i])) <= 10) {
      new_genes <- c(new_genes, toString(genes[[1]][i]))
   }
   print(i)
}
write.table(new_genes, "human_mouse_gene_symbols_simple_only.txt", sep="\t", quote= F, row.names = F, col.names = F)

length(new_genes)
length(genes[[1]])

#######################################
# N number of colors through rainbow
colors <- NULL
N <- 
   
for (i in 1:N){
   colors[i] = spectrum (i / ( N - 1));
}

spectrum <- function(w) {
   if (w>1) w=1;
   if (w<0) w=0;
   
   w=w*(645-380)+380;
   R,B,G;
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
   return new Color(R,G,B);
}