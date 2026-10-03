// TODO: return true if n is a prime number, false otherwise
boolean isPrime(int n) {
    return false;
}

void main() {
    Scanner scanner = new Scanner(System.in);
    int t = scanner.nextInt();
    for (int i = 0; i < t; i++) {
        int n = scanner.nextInt();
        if (isPrime(n)) {
            IO.println(n + " is prime");
        } else {
            IO.println(n + " is not prime");
        }
    }
}
