void main() {
    String[] parts = IO.readln().trim().split(" ");
    long a = Long.parseLong(parts[0]);
    long b = Long.parseLong(parts[2]);
    long result = switch (parts[1]) {
        case "+" -> a + b;
        case "-" -> a - b;
        default -> a * b;
    };
    if (result < Integer.MIN_VALUE || result > Integer.MAX_VALUE) {
        IO.println("Overflow");
    } else {
        IO.println(result);
    }
}
