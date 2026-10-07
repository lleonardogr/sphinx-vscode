int[] utf8(int code) {
    if (code < 0x80) {
        return new int[] {code};
    }
    int count = code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
    int[] bytes = new int[count];
    for (int i = count - 1; i > 0; i--) {
        bytes[i] = 0x80 + code % 64;
        code /= 64;
    }
    int marker = count == 2 ? 0xC0 : count == 3 ? 0xE0 : 0xF0;
    bytes[0] = marker + code;
    return bytes;
}

void main() {
    int code = Integer.parseInt(IO.readln().trim().substring(2), 16);
    StringBuilder out = new StringBuilder();
    for (int b : utf8(code)) {
        if (!out.isEmpty()) {
            out.append(' ');
        }
        out.append(String.format("%02X", b));
    }
    IO.println(out);
}
