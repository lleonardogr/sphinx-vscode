String hex(int value, int digits) {
    StringBuilder s = new StringBuilder();
    for (int i = digits - 1; i >= 0; i--) {
        s.append("0123456789ABCDEF".charAt((value >> (4 * i)) & 15));
    }
    return s.toString();
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" ");
    int[] bytes = new int[n];
    for (int i = 0; i < n; i++) {
        bytes[i] = Integer.parseInt(parts[i]);
    }
    for (int start = 0; start < n; start += 16) {
        StringBuilder hexPart = new StringBuilder();
        StringBuilder text = new StringBuilder();
        for (int i = start; i < Math.min(start + 16, n); i++) {
            if (i > start) {
                hexPart.append(' ');
            }
            hexPart.append(hex(bytes[i], 2));
            text.append(bytes[i] >= 32 && bytes[i] <= 126 ? (char) bytes[i] : '.');
        }
        while (hexPart.length() < 47) {
            hexPart.append(' ');
        }
        IO.println(hex(start, 4) + "  " + hexPart + "  " + text);
    }
}
