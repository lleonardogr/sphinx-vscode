long power(int base, int exponent) {
    long result = 1;
    for (int i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

void main() {
    String[] parts = IO.readln().trim().split("\\s+");
    int base = Integer.parseInt(parts[0]);
    int exponent = Integer.parseInt(parts[1]);
    IO.println(base + "^" + exponent + " = " + power(base, exponent));
}
