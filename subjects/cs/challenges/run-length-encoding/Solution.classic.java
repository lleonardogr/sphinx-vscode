import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String mode = scanner.next();
        String text = scanner.next();
        String result;
        if (mode.equals("encode")) {
            StringBuilder sb = new StringBuilder();
            char current = text.charAt(0);
            int run = 0;
            for (char c : text.toCharArray()) {
                if (c == current) {
                    run++;
                } else {
                    sb.append(run).append(current);
                    current = c;
                    run = 1;
                }
            }
            sb.append(run).append(current);
            result = sb.toString();
        } else {
            StringBuilder sb = new StringBuilder();
            String number = "";
            boolean ok = true;
            for (char c : text.toCharArray()) {
                if (c >= '0' && c <= '9') {
                    number += c;
                } else if (number.isEmpty() || Integer.parseInt(number) == 0) {
                    ok = false;
                    break;
                } else {
                    for (int k = 0; k < Integer.parseInt(number); k++) {
                        sb.append(c);
                    }
                    number = "";
                }
            }
            result = ok && number.isEmpty() ? sb.toString() : null;
        }
        if (result == null) {
            System.out.println("Invalid code");
        } else {
            System.out.println(result);
            System.out.println("Length: " + text.length() + " -> " + result.length());
        }
    }
}
