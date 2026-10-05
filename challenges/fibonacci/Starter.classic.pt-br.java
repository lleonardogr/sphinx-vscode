import java.util.Scanner;

public class Main {

    // Guarda respostas já calculadas: memo[n] é 0 até fib(n) ser conhecido.
    static long[] memo = new long[91];

    // TODO: devolva o n-ésimo número de Fibonacci de forma recursiva, usando memo para não repetir trabalho
    static long fib(int n) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("F(" + n + ") = " + fib(n));
    }
}
