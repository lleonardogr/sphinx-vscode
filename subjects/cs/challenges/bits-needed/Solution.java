void main() {
    long n = Long.parseLong(IO.readln().trim());
    int bits = 0;
    do {
        bits++;
        n /= 2;
    } while (n > 0);
    IO.println("Bits: " + bits);
    IO.println("Bytes: " + (bits + 7) / 8);
}
