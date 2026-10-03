void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    IO.println(sum);
}
