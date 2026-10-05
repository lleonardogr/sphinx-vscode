import java.util.*;

class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

class Calculator {
    // TODO: return a op b, or throw a CalculatorException with the right message
    static int calculate(int a, String op, int b) throws CalculatorException {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < t; i++) {
            String[] p = scanner.nextLine().trim().split(" +");

            // TODO: print a op b = result, or Error: … for any problem with the line
        }
    }
}
