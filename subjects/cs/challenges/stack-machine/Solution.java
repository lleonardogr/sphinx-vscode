int needs(String op) {
    return switch (op) {
        case "PUSH" -> 0;
        case "DUP", "PRINT" -> 1;
        case "ADD", "SUB", "MUL" -> 2;
        default -> -1;
    };
}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    long[] stack = new long[n];
    int top = 0;
    for (int line = 1; line <= n; line++) {
        String[] parts = IO.readln().trim().split(" ");
        int need = needs(parts[0]);
        if (need < 0) {
            IO.println("Error at line " + line + ": unknown instruction");
            return;
        }
        if (top < need) {
            IO.println("Error at line " + line + ": stack underflow");
            return;
        }
        switch (parts[0]) {
            case "PUSH" -> stack[top++] = Long.parseLong(parts[1]);
            case "DUP" -> {
                stack[top] = stack[top - 1];
                top++;
            }
            case "PRINT" -> IO.println(stack[--top]);
            default -> {
                long b = stack[--top];
                long a = stack[--top];
                stack[top++] = parts[0].equals("ADD") ? a + b : parts[0].equals("SUB") ? a - b : a * b;
            }
        }
    }
    StringBuilder rest = new StringBuilder();
    for (int i = 0; i < top; i++) {
        rest.append(i == 0 ? "" : " ").append(stack[i]);
    }
    IO.println("Stack: " + (top == 0 ? "empty" : rest));
}
