import java.util.Scanner;

public class Main {
    static final String DIGITS = "0123456789ABCDEF";

    static String twoDigits(int b) {
        return "" + DIGITS.charAt(b / 16) + DIGITS.charAt(b % 16);
    }

    static String offset(int position) {
        String s = "";
        for (int i = 0; i < 4; i++) {
            s = DIGITS.charAt(position % 16) + s;
            position = position / 16;
        }
        return s;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] bytes = new int[n];
        for (int i = 0; i < n; i++) {
            bytes[i] = scanner.nextInt();
        }
        String line = "";
        String text = "";
        for (int i = 0; i < n; i++) {
            if (i % 16 != 0) {
                line += " ";
            }
            line += twoDigits(bytes[i]);
            if (bytes[i] < 32 || bytes[i] > 126) {
                text += ".";
            } else {
                text += (char) bytes[i];
            }
            if (i % 16 == 15 || i == n - 1) {
                while (line.length() < 47) {
                    line += " ";
                }
                System.out.println(offset(i - i % 16) + "  " + line + "  " + text);
                line = "";
                text = "";
            }
        }
    }
}
