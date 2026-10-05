int digitSum(long n) {
    if (n < 10) {
        return (int) n;
    }
    return (int) (n % 10) + digitSum(n / 10);
}

int digitalRoot(long n) {
    if (n < 10) {
        return (int) n;
    }
    return digitalRoot(digitSum(n));
}

void main() {
    long n = Long.parseLong(IO.readln().trim());
    IO.println("Digit sum: " + digitSum(n));
    IO.println("Digital root: " + digitalRoot(n));
}
