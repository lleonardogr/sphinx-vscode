String[] NAMES = {"HALT", "LOAD", "ADD", "SUB", "STORE", "JUMP", "JZ", "OUT"};

int value(String bits) {
    int v = 0;
    for (char c : bits.toCharArray()) {
        v = v * 2 + (c - '0');
    }
    return v;
}

String decode(String instruction) {
    if (instruction.length() != 8 || !instruction.chars().allMatch(c -> c == '0' || c == '1')) {
        return "Invalid instruction";
    }
    int opcode = value(instruction.substring(0, 4));
    int operand = value(instruction.substring(4));
    if (opcode >= NAMES.length) {
        return "Unknown opcode " + instruction.substring(0, 4);
    }
    String name = NAMES[opcode];
    return name.equals("HALT") || name.equals("OUT") ? name : name + " " + operand;
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        IO.println(decode(IO.readln().trim()));
    }
}
