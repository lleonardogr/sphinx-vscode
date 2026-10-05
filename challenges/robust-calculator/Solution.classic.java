import java.util.*;

class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

class Calculator {
    static int calculate(int a, String op, int b) throws CalculatorException {
        long result;
        switch (op) {
            case "+": result = (long) a + b; break;
            case "-": result = (long) a - b; break;
            case "*": result = (long) a * b; break;
            case "/":
            case "%":
                if (b == 0) throw new CalculatorException("division by zero");
                result = op.equals("/") ? (long) a / b : a % b;
                break;
            default: throw new CalculatorException("unknown operator " + op);
        }
        if (result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) throw new CalculatorException("overflow");
        return (int) result;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int t = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < t; i++) {
            String[] p = scanner.nextLine().trim().split(" +");
            try {
                if (p.length != 3) throw new CalculatorException("expected number operator number");
                int a = Integer.parseInt(p[0]);
                int b = Integer.parseInt(p[2]);
                System.out.println(a + " " + p[1] + " " + b + " = " + Calculator.calculate(a, p[1], b));
            } catch (NumberFormatException e) {
                System.out.println("Error: not a number");
            } catch (CalculatorException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}
