import java.util.Scanner;

public class Main {
    static final String DIGITS = "0123456789ABCDEF";
    static int width = 8;
    static long value = 0;

    static long wrap(long x) {
        long size = 1L << width;
        long rest = x % size;
        return rest < 0 ? rest + size : rest;
    }

    static long toSigned(long x) {
        long half = 1L << (width - 1);
        return x < half ? x : x - 2 * half;
    }

    static String show() {
        String bin = "";
        long x = value;
        for (int i = 0; i < width; i++) {
            if (i > 0 && i % 4 == 0) {
                bin = " " + bin;
            }
            bin = (x % 2) + bin;
            x = x / 2;
        }
        String hex = "";
        x = value;
        for (int i = 0; i < width / 4; i++) {
            hex = DIGITS.charAt((int) (x % 16)) + hex;
            x = x / 16;
        }
        return "bin " + bin + " | hex " + hex + " | unsigned " + value + " | signed " + toSigned(value);
    }

    // Reads digits in base 2 or 16; returns -1 when one isn't valid.
    static long read(String text, int base) {
        if (text.isEmpty()) {
            return -1;
        }
        long result = 0;
        for (int i = 0; i < text.length(); i++) {
            int d = DIGITS.indexOf(Character.toUpperCase(text.charAt(i)));
            if (d < 0 || d >= base) {
                return -1;
            }
            result = wrap(result * base + d);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        while (!line.equals("quit")) {
            String[] parts = line.split(" ");
            String command = parts[0];
            String arg = parts.length > 1 ? parts[1] : "";
            if (command.equals("dec")) {
                value = wrap(Long.parseLong(arg));
                System.out.println(show());
            } else if (command.equals("hex") || command.equals("bin")) {
                long digits = read(arg, command.equals("hex") ? 16 : 2);
                if (digits < 0) {
                    System.out.println(command.equals("hex") ? "Invalid hex" : "Invalid binary");
                } else {
                    value = digits;
                    System.out.println(show());
                }
            } else if (command.equals("add") || command.equals("sub")) {
                long operand = wrap(Long.parseLong(arg));
                int sign = command.equals("add") ? 1 : -1;
                long unsigned = value + sign * operand;
                long signed = toSigned(value) + sign * toSigned(operand);
                long half = 1L << (width - 1);
                String flags = "";
                if (unsigned < 0 || unsigned >= 2 * half) {
                    flags += command.equals("add") ? " | carry" : " | borrow";
                }
                if (signed < -half || signed >= half) {
                    flags += " | overflow";
                }
                value = wrap(unsigned);
                System.out.println(show() + flags);
            } else if (command.equals("width")) {
                if (arg.equals("8") || arg.equals("16") || arg.equals("32")) {
                    width = Integer.parseInt(arg);
                    value = wrap(value);
                    System.out.println(show());
                } else {
                    System.out.println("Invalid width");
                }
            } else {
                System.out.println("Unknown command");
            }
            line = scanner.nextLine().trim();
        }
    }
}
