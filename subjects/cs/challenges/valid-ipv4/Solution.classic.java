import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String address = scanner.next();
        int parts = 0;
        int value = 0;
        int digits = 0;
        boolean ok = true;
        for (int i = 0; i <= address.length() && ok; i++) {
            char c = i < address.length() ? address.charAt(i) : '.';
            if (c == '.') {
                ok = digits > 0 && value <= 255;
                parts++;
                value = 0;
                digits = 0;
            } else if (c >= '0' && c <= '9') {
                if (digits == 1 && value == 0) {
                    ok = false;
                }
                value = value * 10 + (c - '0');
                digits++;
                ok = ok && digits <= 3;
            } else {
                ok = false;
            }
        }
        System.out.println(ok && parts == 4 ? "Valid" : "Invalid");
    }
}
