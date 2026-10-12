long power(int base, int exponent) {
    long result = 1;
    long square = base;
    while (exponent > 0) {
        if (exponent % 2 == 1) {
            result *= square;
        }
        square *= square;
        exponent /= 2;
    }
    return result;
}

void main() {
    String[] parts = IO.readln().trim().split("\\s+");
    int base = Integer.parseInt(parts[0]);
    int exponent = Integer.parseInt(parts[1]);
    IO.println(base + "^" + exponent + " = " + power(base, exponent));
}
