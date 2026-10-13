void main() {
    String[] parts = IO.readln().trim().split(" ");
    long a = Long.parseLong(parts[0]);
    long b = Long.parseLong(parts[1]);
    long c = Long.parseLong(parts[2]);
    if (a <= 0 || b <= 0 || c <= 0 || a >= b + c || b >= a + c || c >= a + b) {
        IO.println("Not a triangle");
    } else if (a == b && b == c) {
        IO.println("Equilateral");
    } else if (a == b || b == c || a == c) {
        IO.println("Isosceles");
    } else {
        IO.println("Scalene");
    }
}
