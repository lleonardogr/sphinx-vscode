int width = 8;
long value = 0;

void main() {
    while (true) {
        String[] parts = IO.readln().trim().split(" ");
        String command = parts[0];
        if (command.equals("quit")) {
            break;
        }
        // TODO: run the command, then print the value: bin ... | hex ... | unsigned ... | signed ...
        IO.println("Unknown command");
    }
}
