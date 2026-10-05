import java.util.*;
import java.util.function.*;
import java.util.stream.*;

record Grade(String student, String course, int score) {}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<Grade> grades = Stream.generate(scanner::nextLine).limit(n)
                .map(String::trim)
                .map(l -> l.split(" "))
                .map(p -> new Grade(p[0], p[1], Integer.parseInt(p[2])))
                .collect(Collectors.toList());
        TreeMap<String, IntSummaryStatistics> stats = grades.stream()
                .collect(Collectors.groupingBy(Grade::course, TreeMap::new, Collectors.summarizingInt(Grade::score)));
        long students = grades.stream().map(Grade::student).distinct().count();
        System.out.println("Students: " + students + ", courses: " + stats.size());
        stats.forEach((course, s) -> {
            String best = grades.stream()
                    .filter(g -> g.course().equals(course) && g.score() == s.getMax())
                    .map(Grade::student).sorted().findFirst().get();
            System.out.printf("%s: average %.1f, best %s (%d)%n", course, s.getAverage(), best, s.getMax());
        });
        Map<String, Double> averages = grades.stream().collect(Collectors.groupingBy(Grade::student, Collectors.averagingInt(Grade::score)));
        double topAverage = Collections.max(averages.values());
        String top = averages.keySet().stream().filter(k -> averages.get(k) == topAverage).sorted().findFirst().get();
        System.out.printf("Top student: %s (average %.1f)%n", top, topAverage);
        List<String> below = grades.stream().filter(g -> g.score() < 60)
                .sorted(Comparator.comparing(Grade::student).thenComparing(Grade::course))
                .map(g -> g.student() + " (" + g.course() + " " + g.score() + ")")
                .collect(Collectors.toList());
        System.out.println("Below 60: " + (below.isEmpty() ? "none" : String.join(", ", below)));
    }
}
