boolean gate(String name, boolean a, boolean b) {
    return switch (name) {
        case "AND" -> a && b;
        case "OR" -> a || b;
        case "XOR" -> a ^ b;
        case "NAND" -> !(a && b);
        default -> !(a || b);
    };
}

void main() {
    String name = IO.readln().trim();
    if (!List.of("AND", "OR", "XOR", "NAND", "NOR").contains(name)) {
        IO.println("Unknown gate: " + name);
        return;
    }
    IO.println("A B OUT");
    for (int a = 0; a <= 1; a++) {
        for (int b = 0; b <= 1; b++) {
            IO.println(a + " " + b + " " + (gate(name, a == 1, b == 1) ? 1 : 0));
        }
    }
}
