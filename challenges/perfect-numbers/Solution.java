long sumOfDivisors(long n) {
    if (n == 1) return 0;
    long sum = 1;
    for (long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            sum += d;
            long pair = n / d;
            if (pair != d) sum += pair;
        }
    }
    return sum;
}

String classify(long n) {
    long sum = sumOfDivisors(n);
    if (sum == n) return "perfect";
    return sum > n ? "abundant" : "deficient";
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        long n = Long.parseLong(IO.readln().trim());
        IO.println(n + " is " + classify(n));
    }
}
