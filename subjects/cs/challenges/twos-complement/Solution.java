void main() {
    int n = Integer.parseInt(IO.readln().trim());
    if (n < 0) {
        n += 256;
    }
    String bits = "";
    for (int i = 0; i < 8; i++) {
        bits = (n % 2) + bits;
        n /= 2;
    }
    IO.println(bits);
}
