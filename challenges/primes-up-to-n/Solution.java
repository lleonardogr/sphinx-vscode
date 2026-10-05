void main() {
    int n = Integer.parseInt(IO.readln().trim());
    StringBuilder primes = new StringBuilder();
    int count = 0;
    for (int k = 2; k <= n; k++) {
        boolean isPrime = true;
        for (int d = 2; d * d <= k; d++) {
            if (k % d == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            if (count > 0) {
                primes.append(" ");
            }
            primes.append(k);
            count++;
        }
    }
    IO.println(count == 0 ? "No primes" : primes.toString());
    IO.println("Count: " + count);
}
