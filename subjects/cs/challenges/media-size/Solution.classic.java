import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String kind = scanner.next();
        long bits;
        if (kind.equals("image")) {
            bits = scanner.nextLong() * scanner.nextLong() * scanner.nextLong();
        } else {
            bits = scanner.nextLong() * scanner.nextLong() * scanner.nextLong() * scanner.nextLong();
        }
        long bytes = bits / 8;
        if (bits % 8 != 0) {
            bytes++;
        }
        System.out.printf("%d bytes (%.2f MiB)%n", bytes, bytes / (1024.0 * 1024.0));
    }
}
