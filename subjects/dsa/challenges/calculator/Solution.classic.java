import java.util.*;

public class Main {

    // A recursive parser: expression = term (('+' | '-') term)*, term = factor (('*' | '/') factor)*,
    // factor = number | '(' expression ')'.
    static String text;
    static int pos;

    static void skipSpaces() {
        while (pos < text.length() && text.charAt(pos) == ' ') {
            pos++;
        }
    }

    static long expression() {
        long value = term();
        skipSpaces();
        while (pos < text.length() && (text.charAt(pos) == '+' || text.charAt(pos) == '-')) {
            char op = text.charAt(pos++);
            long right = term();
            value = op == '+' ? value + right : value - right;
            skipSpaces();
        }
        return value;
    }

    static long term() {
        long value = factor();
        skipSpaces();
        while (pos < text.length() && (text.charAt(pos) == '*' || text.charAt(pos) == '/')) {
            char op = text.charAt(pos++);
            long right = factor();
            value = op == '*' ? value * right : value / right;
            skipSpaces();
        }
        return value;
    }

    static long factor() {
        skipSpaces();
        if (text.charAt(pos) == '(') {
            pos++;
            long value = expression();
            skipSpaces();
            pos++; // ')'
            return value;
        }
        long value = 0;
        while (pos < text.length() && Character.isDigit(text.charAt(pos))) {
            value = value * 10 + (text.charAt(pos++) - '0');
        }
        return value;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int q = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < q; i++) {
            text = scanner.nextLine();
            pos = 0;
            try {
                System.out.println(expression());
            } catch (ArithmeticException e) {
                System.out.println("error: division by zero");
            }
        }
    }
}
