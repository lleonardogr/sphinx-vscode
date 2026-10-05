long factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    IO.println(n + "! = " + factorial(n));
}
