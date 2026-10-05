record Point(int x, int y) {
    double distanceTo(Point other) {
        int dx = other.x - x;
        int dy = other.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    Point translate(int dx, int dy) {
        return new Point(x + dx, y + dy);
    }
}

void main() {
    String[] p = IO.readln().trim().split(" ");
    String[] d = IO.readln().trim().split(" ");
    Point a = new Point(Integer.parseInt(p[0]), Integer.parseInt(p[1]));
    Point b = new Point(Integer.parseInt(p[2]), Integer.parseInt(p[3]));
    Point moved = a.translate(Integer.parseInt(d[0]), Integer.parseInt(d[1]));
    IO.println("A = " + a);
    IO.println("B = " + b);
    IO.println("Distance: %.2f".formatted(a.distanceTo(b)));
    IO.println("A moved = " + moved);
    IO.println("A moved equals B: " + moved.equals(b));
}
