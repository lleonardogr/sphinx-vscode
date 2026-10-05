// TODO: return the sum of the proper divisors of n (every divisor except n itself)
long sumOfDivisors(long n) {
    return 0;
}

// TODO: return "perfect", "abundant" or "deficient", using sumOfDivisors
String classify(long n) {
    return "";
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        long n = Long.parseLong(IO.readln().trim());
        IO.println(n + " is " + classify(n));
    }
}
