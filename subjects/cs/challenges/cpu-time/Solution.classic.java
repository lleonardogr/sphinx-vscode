import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double ghz = Double.parseDouble(scanner.next());
        long cpi = scanner.nextLong();
        long instructions = scanner.nextLong();
        long cycles = cpi * instructions;
        double cyclesPerMs = ghz * 1_000_000;
        System.out.println("Cycles: " + cycles);
        System.out.printf("Time: %.3f ms%n", cycles / cyclesPerMs);
    }
}
