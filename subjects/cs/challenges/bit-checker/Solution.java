void main() {
    String[] parts = IO.readln().trim().split(" ");
    int n = Integer.parseInt(parts[0]);
    int k = Integer.parseInt(parts[1]);
    int bit = (n >> k) & 1;
    IO.println("Bit " + k + " of " + n + " is " + bit);
}
