void main() {
    String[] parts = IO.readln().trim().split(" ");
    int a = Integer.parseInt(parts[0]);
    int b = Integer.parseInt(parts[1]);
    int c = Integer.parseInt(parts[2]);
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
