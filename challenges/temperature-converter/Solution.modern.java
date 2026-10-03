void main() {
    double celsius = Double.parseDouble(IO.readln().trim());
    double fahrenheit = celsius * 9 / 5 + 32;
    IO.println("%.1f C = %.1f F".formatted(celsius, fahrenheit));
}
