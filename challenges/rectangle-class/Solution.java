class Rectangle {
    private final int width;
    private final int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        return width * height;
    }

    int perimeter() {
        return 2 * (width + height);
    }

    boolean isSquare() {
        return width == height;
    }
}

void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    for (int i = 0; i < n; i++) {
        Rectangle r = new Rectangle(scanner.nextInt(), scanner.nextInt());
        IO.println("Area: " + r.area() + ", Perimeter: " + r.perimeter() + ", Square: " + r.isSquare());
    }
}
