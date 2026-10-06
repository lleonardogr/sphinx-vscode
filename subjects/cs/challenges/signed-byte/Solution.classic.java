import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String bits = scanner.next();
        int unsigned = 0;
        for (int i = 0; i < bits.length(); i++) {
            unsigned = unsigned * 2 + (bits.charAt(i) - '0');
        }
        System.out.println(unsigned >= 128 ? unsigned - 256 : unsigned);
    }
}
