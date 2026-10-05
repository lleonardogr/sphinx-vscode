class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

// TODO: devolva a op b, ou lance uma CalculatorException com a mensagem certa
int calculate(int a, String op, int b) throws CalculatorException {
    return 0;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" +");

        // TODO: imprima a op b = resultado, ou Error: … para qualquer problema na linha
    }
}
