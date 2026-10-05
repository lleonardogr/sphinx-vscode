import java.util.*;

public class Main {

    static Map<Integer, Long> memo = new HashMap<>();

    static long fib(int n) {
        if (n < 2) return n;
        Long known = memo.get(n);
        if (known != null) return known;
        long value = fib(n - 1) + fib(n - 2);
        memo.put(n, value);
        return value;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("F(" + n + ") = " + fib(n));
    }
}
