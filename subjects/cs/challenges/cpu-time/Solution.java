void main() {
    String[] parts = IO.readln().trim().split(" ");
    double ghz = Double.parseDouble(parts[0]);
    long cpi = Long.parseLong(parts[1]);
    long instructions = Long.parseLong(parts[2]);
    long cycles = instructions * cpi;
    double ms = cycles / (ghz * 1e9) * 1000;
    IO.println("Cycles: " + cycles);
    IO.println("Time: " + String.format("%.3f", ms) + " ms");
}
