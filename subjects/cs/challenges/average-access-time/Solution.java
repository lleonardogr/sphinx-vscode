void main() {
    String[] parts = IO.readln().trim().split(" ");
    double cache = Double.parseDouble(parts[0]);
    double memory = Double.parseDouble(parts[1]);
    double hitRate = Double.parseDouble(parts[2]) / 100;
    double average = cache + (1 - hitRate) * memory;
    IO.println("Average: " + String.format("%.2f", average) + " ns");
    IO.println("Speedup: " + String.format("%.2f", memory / average) + "x");
}
