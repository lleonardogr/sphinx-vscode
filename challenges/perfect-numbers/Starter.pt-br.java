// TODO: devolva a soma dos divisores próprios de n (todos os divisores menos o próprio n)
long sumOfDivisors(long n) {
    return 0;
}

// TODO: devolva "perfect", "abundant" ou "deficient", usando sumOfDivisors
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
