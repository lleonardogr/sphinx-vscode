int ones(int n) {
    int count = 0;
    while (n > 0) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

void main() {
    String[] parts = IO.readln().trim().split(" ");
    int sent = Integer.parseInt(parts[0]);
    int received = Integer.parseInt(parts[1]);
    int ones = ones(sent);
    IO.println("Ones: " + ones);
    IO.println("Parity bit: " + ones % 2);
    IO.println("Received: " + (ones % 2 == ones(received) % 2 ? "OK" : "error detected"));
}
