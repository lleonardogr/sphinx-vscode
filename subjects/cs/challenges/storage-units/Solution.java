String size(long bytes, int base, String suffix) {
    double value = bytes;
    int count = 0;
    while (value >= base && count < 5) {
        value /= base;
        count++;
    }
    if (count == 0) {
        return bytes + " B";
    }
    return String.format("%.2f", value) + " " + "KMGTP".charAt(count - 1) + suffix;
}

void main() {
    long bytes = Long.parseLong(IO.readln().trim());
    IO.println("SI: " + size(bytes, 1000, "B"));
    IO.println("Binary: " + size(bytes, 1024, "iB"));
}
