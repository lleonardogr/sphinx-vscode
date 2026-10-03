void main() {
    int n = Integer.parseInt(IO.readln().trim());
    long factorial = 1;
    for (int i = 2; i <= n; i++) {
        factorial *= i;
    }
    IO.println(factorial);
}
