import java.util.*;

class CalculatorException extends Exception {
    CalculatorException(String message) {
        super(message);
    }
}

class Calculator {
    // TODO: devolva a op b, ou lance uma CalculatorException com a mensagem certa
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

            // TODO: imprima a op b = resultado, ou Error: … para qualquer problema na linha
        }
    }
}
