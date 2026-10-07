void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] program = new String[n];
    for (int i = 0; i < n; i++) {
        program[i] = IO.readln().trim();
    }
    int[] memory = new int[16];
    int acc = 0;
    int pc = 1;
    int steps = 0;
    while (pc >= 1 && pc <= n) {
        if (steps == 1000) {
            IO.println("Step limit reached");
            return;
        }
        String[] parts = program[pc - 1].split(" ");
        int arg = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
        int next = pc + 1;
        switch (parts[0]) {
            case "SET" -> acc = arg;
            case "LOAD" -> acc = memory[arg];
            case "STORE" -> memory[arg] = acc;
            case "ADD" -> acc += memory[arg];
            case "SUB" -> acc -= memory[arg];
            case "JUMP" -> next = arg;
            case "JZ" -> next = acc == 0 ? arg : next;
            case "OUT" -> IO.println(acc);
            case "HALT" -> next = n + 1;
            default -> {
                IO.println("Error at line " + pc + ": " + program[pc - 1]);
                return;
            }
        }
        steps++;
        pc = next;
    }
    IO.println("Halted after " + steps + " steps");
}
