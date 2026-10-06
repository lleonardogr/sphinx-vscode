import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String bits = scanner.next();
        long value = 0;
        for (int i = 0; i < bits.length(); i++) {
            value = value * 2 + (bits.charAt(i) - '0');
        }
        System.out.println(value);
    }
}
