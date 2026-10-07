import java.util.Scanner;

public class Main {

    static String hex(int b) {
        String digits = "0123456789ABCDEF";
        return "" + digits.charAt(b / 16) + digits.charAt(b % 16);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int code = Integer.parseInt(scanner.next().substring(2), 16);
        String out;
        if (code <= 0x7F) {
            out = hex(code);
        } else if (code <= 0x7FF) {
            out = hex(0xC0 | (code >> 6)) + " " + hex(0x80 | (code & 0x3F));
        } else if (code <= 0xFFFF) {
            out = hex(0xE0 | (code >> 12)) + " " + hex(0x80 | ((code >> 6) & 0x3F)) + " " + hex(0x80 | (code & 0x3F));
        } else {
            out = hex(0xF0 | (code >> 18)) + " " + hex(0x80 | ((code >> 12) & 0x3F)) + " " + hex(0x80 | ((code >> 6) & 0x3F)) + " " + hex(0x80 | (code & 0x3F));
        }
        System.out.println(out);
    }
}
