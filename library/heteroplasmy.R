args <- commandArgs(TRUE);
csv  <- paste0(args[1], ".csv");
png  <- paste0(args[1], ".png");
pdf  <- paste0(args[1], ".pdf");
hp   <- read.csv(csv, header = T, sep = ";");

png(filename=png);
plot(hp$SNP, hp$heteroplasmy, xlab = "SNP", ylab = "heterolasmy", type = "l", main = args[2]);

pdf(file=pdf);
plot(hp$SNP, hp$heteroplasmy, xlab = "SNP", ylab = "heterolasmy", type = "l", main = args[2]);
dev.off();