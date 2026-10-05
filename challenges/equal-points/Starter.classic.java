import java.util.*;

class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // TODO: override equals so two points with the same x and y are equal

    // TODO: override hashCode so equal points have the same hash code

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Point> points = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            points.add(new Point(scanner.nextInt(), scanner.nextInt()));
        }
        Set<Point> unique = new HashSet<>(points);
        Map<Point, Integer> counts = new LinkedHashMap<>();
        for (Point p : points) {
            counts.merge(p, 1, Integer::sum);
        }
        Point most = points.get(0);
        for (Point p : counts.keySet()) {
            if (counts.get(p) > counts.get(most)) most = p;
        }
        System.out.println("Points read: " + n);
        System.out.println("Unique points: " + unique.size());
        System.out.println("Most repeated: " + most + " x" + counts.get(most));
        System.out.println("Contains (0, 0): " + unique.contains(new Point(0, 0)));
    }
}
