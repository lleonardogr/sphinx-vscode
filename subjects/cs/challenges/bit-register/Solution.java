String bits(int value) {
    StringBuilder out = new StringBuilder();
    for (int k = 7; k >= 0; k--) {
        out.append((value >> k) & 1);
    }
    return out.toString();
}

void main() {
    int register = 0;
    String line = IO.readln().trim();
    while (!line.equals("end")) {
        String[] parts = line.split(" ");
        int arg = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
        Integer next = switch (parts[0]) {
            case "set" -> register | (1 << arg);
            case "clear" -> register & ~(1 << arg);
            case "toggle" -> register ^ (1 << arg);
            case "shl" -> register << arg;
            case "shr" -> register >> arg;
            case "not" -> ~register;
            default -> null;
        };
        if (next == null) {
            IO.println("Unknown command: " + line);
        } else {
            register = next & 0xFF;
            IO.println(bits(register));
        }
        line = IO.readln().trim();
    }
}
