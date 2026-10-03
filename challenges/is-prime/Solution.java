boolean isPrime(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split("\\s+");
    for (int i = 0; i < t; i++) {
        int n = Integer.parseInt(parts[i]);
        IO.println(n + (isPrime(n) ? " is prime" : " is not prime"));
    }
}
