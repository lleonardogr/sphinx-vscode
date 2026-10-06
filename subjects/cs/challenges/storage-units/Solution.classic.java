import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long bytes = scanner.nextLong();
        String prefixes = "KMGTP";
        double si = bytes;
        int siCount = 0;
        while (si >= 1000 && siCount < prefixes.length()) {
            si = si / 1000;
            siCount++;
        }
        double bin = bytes;
        int binCount = 0;
        while (bin >= 1024 && binCount < prefixes.length()) {
            bin = bin / 1024;
            binCount++;
        }
        if (siCount == 0) {
            System.out.println("SI: " + bytes + " B");
        } else {
            System.out.printf("SI: %.2f %cB%n", si, prefixes.charAt(siCount - 1));
        }
        if (binCount == 0) {
            System.out.println("Binary: " + bytes + " B");
        } else {
            System.out.printf("Binary: %.2f %ciB%n", bin, prefixes.charAt(binCount - 1));
        }
    }
}
