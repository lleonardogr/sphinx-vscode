import java.util.Scanner;

public class Main {

    static final String DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    static int digit(char c, int base) {
        int d = DIGITS.indexOf(Character.toUpperCase(c));
        return d < base ? d : -1;
    }

    static long toValue(String digits, int base) {
        long value = 0;
        for (char c : digits.toCharArray()) value = value * base + digit(c, base);
        return value;
    }

    static String inBase(long value, int base) {
        String out = "";
        do {
            out = DIGITS.charAt((int) (value % base)) + out;
            value /= base;
        } while (value > 0);
        return out;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String number = scanner.next();
        int from = scanner.nextInt();
        int to = scanner.nextInt();
        if (from < 2 || from > 36 || to < 2 || to > 36) {
            System.out.println("Invalid base");
            return;
        }
        for (char c : number.toCharArray()) {
            if (digit(c, from) < 0) {
                System.out.println("Invalid digit " + c + " for base " + from);
                return;
            }
        }
        System.out.println(inBase(toValue(number, from), to));
    }
}
