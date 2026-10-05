import java.util.*;
import java.util.stream.*;

record Student(String name, int score) {}

public class Main {
    static String names(List<Student> group) {
        String joined = group.stream().map(Student::name).collect(Collectors.joining(", "));
        return joined.isEmpty() ? "none" : joined;
    }

    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        List<Student> students = Stream.of(line.split(" "))
                .map(e -> new Student(e.substring(0, e.indexOf(':')), Integer.parseInt(e.substring(e.indexOf(':') + 1))))
                .collect(Collectors.toList());
        Map<Boolean, List<Student>> groups = students.stream().collect(Collectors.partitioningBy(s -> s.score() >= 60));
        System.out.println("Passed (" + groups.get(true).size() + "): " + names(groups.get(true)));
        System.out.println("Failed (" + groups.get(false).size() + "): " + names(groups.get(false)));
        System.out.printf("Average: %.1f%n", students.stream().mapToInt(Student::score).average().orElse(0));
    }
}
