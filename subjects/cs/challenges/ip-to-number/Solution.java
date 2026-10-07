String bits8(int b) {
    String s = "";
    for (int i = 0; i < 8; i++) {
        s = (b % 2) + s;
        b /= 2;
    }
    return s;
}

void main() {
    String[] parts = IO.readln().trim().split("\\.");
    long number = 0;
    List<String> groups = new ArrayList<>();
    for (String part : parts) {
        int b = Integer.parseInt(part);
        number = number * 256 + b;
        groups.add(bits8(b));
    }
    IO.println("Number: " + number);
    IO.println("Binary: " + String.join(".", groups));
}
