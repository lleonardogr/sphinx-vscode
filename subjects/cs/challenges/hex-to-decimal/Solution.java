void main() {
    String hex = IO.readln().trim();
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
        hex = hex.substring(2);
    }
    long value = 0;
    for (int i = 0; i < hex.length(); i++) {
        char c = hex.charAt(i);
        int digit = "0123456789ABCDEF".indexOf(Character.toUpperCase(c));
        if (digit < 0) {
            IO.println("Invalid hex digit: " + c);
            return;
        }
        value = value * 16 + digit;
    }
    IO.println(value);
}
