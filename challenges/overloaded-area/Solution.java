double area(double radius) {
    return Math.PI * radius * radius;
}

double area(double width, double height) {
    return width * height;
}

double area(double a, double b, double c) {
    double s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

void main() {
    int t = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < t; i++) {
        String[] p = IO.readln().trim().split(" ");
        double area = switch (p[0]) {
            case "circle" -> area(Double.parseDouble(p[1]));
            case "rectangle" -> area(Double.parseDouble(p[1]), Double.parseDouble(p[2]));
            default -> area(Double.parseDouble(p[1]), Double.parseDouble(p[2]), Double.parseDouble(p[3]));
        };
        IO.println("Area of the %s: %.2f".formatted(p[0], area));
    }
}
