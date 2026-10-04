import java.util.*;

public class Main {
    static String letter(int grade) {
        if (grade >= 90) return "A";
        if (grade >= 80) return "B";
        if (grade >= 70) return "C";
        if (grade >= 60) return "D";
        return "F";
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Integer> grades = new ArrayList<>();
        System.out.println("=== Grade Book ===");
        System.out.println("1. Add grade");
        System.out.println("2. List grades");
        System.out.println("3. Statistics");
        System.out.println("4. Letter grades");
        System.out.println("0. Exit");

        while (true) {
            String option = scanner.nextLine().trim();
            if (option.equals("0")) {
                break;
            }
            if (option.equals("1")) {
                int grade = Integer.parseInt(scanner.nextLine().trim());
                if (grade >= 0 && grade <= 100) {
                    grades.add(grade);
                    System.out.println("Added " + grade);
                } else {
                    System.out.println("Invalid grade");
                }
            } else if (!option.equals("2") && !option.equals("3") && !option.equals("4")) {
                System.out.println("Invalid option");
            } else if (grades.isEmpty()) {
                System.out.println("No grades yet");
            } else if (option.equals("2")) {
                StringBuilder line = new StringBuilder("Grades: ");
                for (int i = 0; i < grades.size(); i++) {
                    if (i > 0) line.append(", ");
                    line.append(grades.get(i));
                }
                System.out.println(line);
            } else if (option.equals("3")) {
                int sum = 0;
                for (int grade : grades) sum += grade;
                System.out.printf("Average: %.2f%n", (double) sum / grades.size());
                System.out.println("Highest: " + Collections.max(grades));
                System.out.println("Lowest: " + Collections.min(grades));
            } else {
                for (int grade : grades) {
                    System.out.println(grade + " -> " + letter(grade));
                }
            }
        }
        System.out.println("Goodbye!");
    }
}
