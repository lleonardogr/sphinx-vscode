void main() {
    String[] parts = IO.readln().trim().split("\\s+");
    double width = Double.parseDouble(parts[0]);
    double height = Double.parseDouble(parts[1]);
    IO.println(String.format("Area: %.2f", width * height));
    IO.println(String.format("Perimeter: %.2f", 2 * (width + height)));
}
