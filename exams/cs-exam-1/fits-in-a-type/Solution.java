String smallest(long x) {
    if (x >= -128 && x <= 127) {
        return "byte";
    }
    if (x >= -32768 && x <= 32767) {
        return "short";
    }
    if (x >= -2147483648L && x <= 2147483647L) {
        return "int";
    }
    return "long";
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        long x = Long.parseLong(IO.readln().trim());
        IO.println(x + ": " + smallest(x));
    }
}
