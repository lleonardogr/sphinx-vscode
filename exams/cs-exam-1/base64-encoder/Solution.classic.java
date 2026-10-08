import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        // All the bits as a string of 0s and 1s, 8 per character.
        String bits = "";
        for (int i = 0; i < text.length(); i++) {
            int code = text.charAt(i);
            String eight = "";
            for (int k = 0; k < 8; k++) {
                eight = (code % 2) + eight;
                code = code / 2;
            }
            bits += eight;
        }
        while (bits.length() % 6 != 0) {
            bits += "0";
        }
        String result = "";
        for (int i = 0; i < bits.length(); i += 6) {
            int value = 0;
            for (int k = i; k < i + 6; k++) {
                value = value * 2 + (bits.charAt(k) - '0');
            }
            result += alphabet.charAt(value);
        }
        while (result.length() % 4 != 0) {
            result += "=";
        }
        System.out.println(result);
    }
}
