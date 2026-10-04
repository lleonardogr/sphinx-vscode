void main() {
    IO.println("=== Calculator ===");
    IO.println("1. Add");
    IO.println("2. Subtract");
    IO.println("3. Multiply");
    IO.println("4. Divide");
    IO.println("0. Exit");

    int operations = 0;
    while (true) {
        String option = IO.readln().trim();
        if (option.equals("0")) {
            break;
        }
        if (!option.equals("1") && !option.equals("2") && !option.equals("3") && !option.equals("4")) {
            IO.println("Invalid option");
            continue;
        }
        String[] parts = IO.readln().trim().split("\\s+");
        int a = Integer.parseInt(parts[0]);
        int b = Integer.parseInt(parts[1]);
        switch (option) {
            case "1" -> IO.println(a + " + " + b + " = " + (a + b));
            case "2" -> IO.println(a + " - " + b + " = " + (a - b));
            case "3" -> IO.println(a + " * " + b + " = " + (a * b));
            default -> {
                if (b == 0) {
                    IO.println("Cannot divide by zero");
                    continue;
                }
                IO.println(a + " / " + b + " = " + (a / b));
            }
        }
        operations++;
    }
    IO.println("Operations: " + operations);
    IO.println("Goodbye!");
}
