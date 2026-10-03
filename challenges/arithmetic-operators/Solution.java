void main() {
    String[] parts = IO.readln().trim().split("\\s+");
    int a = Integer.parseInt(parts[0]);
    int b = Integer.parseInt(parts[1]);
    IO.println(a + " + " + b + " = " + (a + b));
    IO.println(a + " - " + b + " = " + (a - b));
    IO.println(a + " * " + b + " = " + (a * b));
    IO.println(a + " / " + b + " = " + (a / b));
    IO.println(a + " % " + b + " = " + (a % b));
}
