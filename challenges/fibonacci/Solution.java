long[] memo = new long[91];

long fib(int n) {
    if (n < 2) {
        return n;
    }
    if (memo[n] == 0) {
        memo[n] = fib(n - 1) + fib(n - 2);
    }
    return memo[n];
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println("F(" + n + ") = " + fib(n));
}
