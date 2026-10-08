int width = 8;
long value = 0;

long mask() {
    return (1L << width) - 1;
}

long signed(long bits) {
    return bits >= 1L << (width - 1) ? bits - (1L << width) : bits;
}

String display() {
    StringBuilder bin = new StringBuilder();
    for (int i = width - 1; i >= 0; i--) {
        bin.append((value >> i) & 1);
        if (i > 0 && i % 4 == 0) {
            bin.append(' ');
        }
    }
    StringBuilder hex = new StringBuilder();
    for (int i = width / 4 - 1; i >= 0; i--) {
        hex.append("0123456789ABCDEF".charAt((int) ((value >> (4 * i)) & 15)));
    }
    return "bin " + bin + " | hex " + hex + " | unsigned " + value + " | signed " + signed(value);
}

// The digits read in `base`, wrapped to the width, or -1 when a digit isn't valid.
long parse(String digits, int base) {
    if (digits.isEmpty()) {
        return -1;
    }
    long result = 0;
    for (char c : digits.toCharArray()) {
        int d = Character.digit(c, base);
        if (d < 0) {
            return -1;
        }
        result = result * base + d;
    }
    return result & mask();
}

void main() {
    while (true) {
        String[] parts = IO.readln().trim().split("\\s+");
        String command = parts[0];
        String arg = parts.length > 1 ? parts[1] : "";
        if (command.equals("quit")) {
            break;
        }
        switch (command) {
            case "dec" -> {
                value = Long.parseLong(arg) & mask();
                IO.println(display());
            }
            case "hex", "bin" -> {
                long read = parse(arg, command.equals("hex") ? 16 : 2);
                if (read < 0) {
                    IO.println(command.equals("hex") ? "Invalid hex" : "Invalid binary");
                } else {
                    value = read;
                    IO.println(display());
                }
            }
            case "add", "sub" -> {
                boolean add = command.equals("add");
                long operand = Long.parseLong(arg) & mask();
                long result = add ? value + operand : value - operand;
                long exact = add ? signed(value) + signed(operand) : signed(value) - signed(operand);
                boolean carry = result < 0 || result > mask();
                value = result & mask();
                boolean overflow = exact != signed(value);
                IO.println(display() + (carry ? (add ? " | carry" : " | borrow") : "") + (overflow ? " | overflow" : ""));
            }
            case "width" -> {
                if (arg.equals("8") || arg.equals("16") || arg.equals("32")) {
                    width = Integer.parseInt(arg);
                    value &= mask();
                    IO.println(display());
                } else {
                    IO.println("Invalid width");
                }
            }
            default -> IO.println("Unknown command");
        }
    }
}
