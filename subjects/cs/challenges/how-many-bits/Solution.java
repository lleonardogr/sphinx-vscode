void main() {
    String[] parts = IO.readln().trim().split(" ");
    long n = Long.parseLong(parts[1]);
    if (parts[0].equals("bits")) {
        long values = 1;
        for (int i = 0; i < n; i++) {
            values *= 2;
        }
        IO.println("Values: " + values);
        IO.println("Largest: " + (values - 1));
    } else {
        int bits = 0;
        do {
            bits++;
            n /= 2;
        } while (n > 0);
        IO.println("Bits: " + bits);
        IO.println("Bytes: " + (bits + 7) / 8);
    }
}
