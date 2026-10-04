// TODO: return true if n is a prime number, false otherwise
boolean isPrime(int n) {
    return false;
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    for (int i = 0; i < t; i++) {
        int n = Integer.parseInt(parts[i]);
        if (isPrime(n)) {
            IO.println(n + " is prime");
        } else {
            IO.println(n + " is not prime");
        }
    }
}
