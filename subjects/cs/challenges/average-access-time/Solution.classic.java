import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double cache = scanner.nextDouble();
        double memory = scanner.nextDouble();
        double hitPercent = scanner.nextDouble();
        double missRate = (100 - hitPercent) / 100;
        double average = cache + missRate * memory;
        System.out.printf("Average: %.2f ns%n", average);
        System.out.printf("Speedup: %.2fx%n", memory / average);
    }
}
