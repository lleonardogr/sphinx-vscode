import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int single = 0;
        int i = 0;
        while (i < n) {
            single++;
            i++;
        }
        long nested = 0;
        for (int a = 0; a < n; a++) {
            for (int b = 0; b < n; b++) {
                nested++;
            }
        }
        int halving = 0;
        for (int m = n; m > 1; m /= 2) {
            halving++;
        }
        System.out.println("Single loop: " + single);
        System.out.println("Nested loops: " + nested);
        System.out.println("Halving loop: " + halving);
    }
}
