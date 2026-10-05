void main() {
    double weight = Double.parseDouble(IO.readln().trim());
    int distance = Integer.parseInt(IO.readln().trim());
    String type = IO.readln().trim();
    double order = Double.parseDouble(IO.readln().trim());
    if (weight <= 0) {
        IO.println("Invalid weight");
        return;
    }
    if (weight > 30) {
        IO.println("Too heavy");
        return;
    }
    double price;
    if (weight <= 1) {
        price = 8.00;
    } else if (weight <= 5) {
        price = 12.50;
    } else {
        price = 20.00;
    }
    if (distance > 500) {
        price *= 1.5;
    }
    boolean express = type.equals("express");
    if (express) {
        price *= 2;
    }
    if (!express && order >= 200.00) {
        IO.println("Shipping: free");
    } else {
        IO.println("Shipping: %.2f".formatted(price));
    }
}
