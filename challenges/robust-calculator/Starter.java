class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

// TODO: return a op b, or throw a CalculatorException with the right message
int calculate(int a, String op, int b) throws CalculatorException {
    return 0;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" +");

        // TODO: print a op b = result, or Error: … for any problem with the line
    }
}
