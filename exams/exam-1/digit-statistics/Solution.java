void main() {
    long n = Long.parseLong(IO.readln().trim());
    int digits = 0, sum = 0, largest = 0, even = 0;
    do {
        int d = (int) (n % 10);
        digits++;
        sum += d;
        largest = Math.max(largest, d);
        if (d % 2 == 0) even++;
        n /= 10;
    } while (n > 0);
    IO.println("Digits: " + digits);
    IO.println("Sum: " + sum);
    IO.println("Largest: " + largest);
    IO.println("Even digits: " + even);
}
