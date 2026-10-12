void main() {
    int n = Integer.parseInt(IO.readln().trim());
    if (n == 0) {
        IO.println(0);
        return;
    }
    String bits = "";
    while (n > 0) {
        bits = (n & 1) + bits;
        n >>= 1;
    }
    IO.println(bits);
}
