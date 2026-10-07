void main() {
    String[] parts = IO.readln().trim().split(" ");
    long a = Long.parseLong(parts[0]);
    long n = Long.parseLong(parts[1]);
    long m = Long.parseLong(parts[2]);
    long naive = n;
    long result = 1 % m;
    long base = a % m;
    int steps = 0;
    while (n > 0) {
        if (n % 2 == 1) {
            result = result * base % m;
        }
        base = base * base % m;
        n /= 2;
        steps++;
    }
    IO.println("Result: " + result);
    IO.println("Fast steps: " + steps);
    IO.println("Naive steps: " + naive);
}
