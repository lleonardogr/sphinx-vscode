void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    IO.println(sum);
}
