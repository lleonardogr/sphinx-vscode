class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

int calculate(int a, String op, int b) throws CalculatorException {
    try {
        return switch (op) {
            case "+" -> Math.addExact(a, b);
            case "-" -> Math.subtractExact(a, b);
            case "*" -> Math.multiplyExact(a, b);
            case "/" -> a / b;
            case "%" -> a % b;
            default -> throw new CalculatorException("unknown operator " + op);
        };
    } catch (ArithmeticException e) {
        throw new CalculatorException(b == 0 ? "division by zero" : "overflow");
    }
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String line = IO.readln().trim();
        String[] p = line.split(" +");
        try {
            if (p.length != 3) {
                throw new CalculatorException("expected number operator number");
            }
            int a = Integer.parseInt(p[0]);
            int b = Integer.parseInt(p[2]);
            IO.println(a + " " + p[1] + " " + b + " = " + calculate(a, p[1], b));
        } catch (NumberFormatException e) {
            IO.println("Error: not a number");
        } catch (CalculatorException e) {
            IO.println("Error: " + e.getMessage());
        }
    }
}
