void main() {
    int n = Integer.parseInt(IO.readln().trim());
    long factorial = 1;
    for (int i = 2; i <= n; i++) {
        if (factorial > Long.MAX_VALUE / i) {
            IO.println("Too big for a long");
            return;
        }
        factorial *= i;
    }
    IO.println(factorial);
}
