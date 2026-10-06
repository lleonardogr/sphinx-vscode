void main() {
    String[] parts = IO.readln().trim().split(" ");
    long bits = 1;
    for (int i = 1; i < parts.length; i++) {
        bits *= Long.parseLong(parts[i]);
    }
    long bytes = (bits + 7) / 8;
    IO.println(bytes + " bytes (" + String.format("%.2f", bytes / 1048576.0) + " MiB)");
}
