import java.util.Scanner;

public class Main {

    static int digitValue(char c) {
        if (c >= '0' && c <= '9') return c - '0';
        if (c >= 'a' && c <= 'f') return c - 'a' + 10;
        if (c >= 'A' && c <= 'F') return c - 'A' + 10;
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String hex = scanner.next();
        int start = hex.length() > 1 && hex.charAt(0) == '0' && (hex.charAt(1) == 'x' || hex.charAt(1) == 'X') ? 2 : 0;
        long value = 0;
        for (int i = start; i < hex.length(); i++) {
            int d = digitValue(hex.charAt(i));
            if (d == -1) {
                System.out.println("Invalid hex digit: " + hex.charAt(i));
                return;
            }
            value = value * 16 + d;
        }
        System.out.println(value);
    }
}
