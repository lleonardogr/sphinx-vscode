import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] parts = scanner.next().split("\\.");
        long number = 0;
        StringBuilder binary = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            int b = Integer.parseInt(parts[i]);
            number = (number << 8) | b;
            if (i > 0) {
                binary.append('.');
            }
            for (int bit = 7; bit >= 0; bit--) {
                binary.append((b >> bit) & 1);
            }
        }
        System.out.println("Number: " + number);
        System.out.println("Binary: " + binary);
    }
}
