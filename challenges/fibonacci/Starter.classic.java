import java.util.Scanner;

public class Main {

    // Remembers answers already computed: memo[n] is 0 until fib(n) is known.
    static long[] memo = new long[91];

    // TODO: return the n-th Fibonacci number recursively, using memo to avoid repeating work
    static long fib(int n) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("F(" + n + ") = " + fib(n));
    }
}
