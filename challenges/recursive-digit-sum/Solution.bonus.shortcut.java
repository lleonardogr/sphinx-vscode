int digitSum(long n) {
    if (n < 10) {
        return (int) n;
    }
    return (int) (n % 10) + digitSum(n / 10);
}

int digitalRoot(long n) {
    return n == 0 ? 0 : (int) (1 + (n - 1) % 9);
}

void main() {
    long n = Long.parseLong(IO.readln().trim());
    IO.println("Digit sum: " + digitSum(n));
    IO.println("Digital root: " + digitalRoot(n));
}
