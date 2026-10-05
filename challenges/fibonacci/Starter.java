// Remembers answers already computed: memo[n] is 0 until fib(n) is known.
long[] memo = new long[91];

// TODO: return the n-th Fibonacci number recursively, using memo to avoid repeating work
long fib(int n) {
    return 0;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println("F(" + n + ") = " + fib(n));
}
