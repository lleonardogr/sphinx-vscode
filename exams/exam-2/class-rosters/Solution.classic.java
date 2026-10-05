import java.util.*;

public class Main {

    static TreeSet<String> get(TreeMap<String, TreeSet<String>> map, String key) {
        if (!map.containsKey(key)) map.put(key, new TreeSet<>());
        return map.get(key);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        TreeMap<String, TreeSet<String>> courses = new TreeMap<>();
        TreeMap<String, TreeSet<String>> students = new TreeMap<>();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("enroll") || command.equals("drop")) {
                String student = scanner.next();
                String course = scanner.next();
                if (command.equals("enroll")) {
                    if (get(courses, course).add(student)) {
                        get(students, student).add(course);
                        System.out.println("Enrolled " + student + " in " + course);
                    } else {
                        System.out.println(student + " is already in " + course);
                    }
                } else if (get(courses, course).remove(student)) {
                    get(students, student).remove(course);
                    System.out.println("Dropped " + student + " from " + course);
                } else {
                    System.out.println(student + " is not in " + course);
                }
            } else {
                String key = scanner.next();
                boolean roster = command.equals("roster");
                TreeSet<String> set = get(roster ? courses : students, key);
                if (set.isEmpty()) System.out.println(key + (roster ? " has no students" : " has no courses"));
                else System.out.println(key + ": " + String.join(", ", set));
            }
        }
    }
}
