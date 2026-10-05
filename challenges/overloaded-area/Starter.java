// TODO: area of a circle with this radius
double area(double radius) {
    return 0;
}

// TODO: area of a rectangle
double area(double width, double height) {
    return 0;
}

// TODO: area of a triangle with sides a, b and c (Heron's formula)
double area(double a, double b, double c) {
    return 0;
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
