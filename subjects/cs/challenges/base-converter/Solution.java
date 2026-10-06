final String DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

long toValue(String digits, int base) {
    long value = 0;
    for (int i = 0; i < digits.length(); i++) {
        value = value * base + DIGITS.indexOf(Character.toUpperCase(digits.charAt(i)));
    }
    return value;
}

String inBase(long value, int base) {
    if (value == 0) {
        return "0";
    }
    StringBuilder out = new StringBuilder();
    while (value > 0) {
        out.insert(0, DIGITS.charAt((int) (value % base)));
        value /= base;
    }
    return out.toString();
}

void main() {
    String[] parts = IO.readln().trim().split(" +");
    String number = parts[0];
    int from = Integer.parseInt(parts[1]);
    int to = Integer.parseInt(parts[2]);
    if (from < 2 || from > 36 || to < 2 || to > 36) {
        IO.println("Invalid base");
        return;
    }
    for (int i = 0; i < number.length(); i++) {
        int d = DIGITS.indexOf(Character.toUpperCase(number.charAt(i)));
        if (d < 0 || d >= from) {
            IO.println("Invalid digit " + number.charAt(i) + " for base " + from);
            return;
        }
    }
    IO.println(inBase(toValue(number, from), to));
}
