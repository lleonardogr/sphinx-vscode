String letter(int grade) {
    if (grade >= 90) {
        return "A";
    } else if (grade >= 80) {
        return "B";
    } else if (grade >= 70) {
        return "C";
    } else if (grade >= 60) {
        return "D";
    }
    return "F";
}

void printStatistics(List<Integer> grades) {
    int sum = 0;
    int highest = grades.get(0);
    int lowest = grades.get(0);
    for (int grade : grades) {
        sum += grade;
        highest = Math.max(highest, grade);
        lowest = Math.min(lowest, grade);
    }
    IO.println("Average: %.2f".formatted((double) sum / grades.size()));
    IO.println("Highest: " + highest);
    IO.println("Lowest: " + lowest);
}

void main() {
    List<Integer> grades = new ArrayList<>();
    IO.println("=== Grade Book ===");
    IO.println("1. Add grade");
    IO.println("2. List grades");
    IO.println("3. Statistics");
    IO.println("4. Letter grades");
    IO.println("0. Exit");

    String option = IO.readln().trim();
    while (!option.equals("0")) {
        switch (option) {
            case "1" -> {
                int grade = Integer.parseInt(IO.readln().trim());
                if (grade < 0 || grade > 100) {
                    IO.println("Invalid grade");
                } else {
                    grades.add(grade);
                    IO.println("Added " + grade);
                }
            }
            case "2", "3", "4" -> {
                if (grades.isEmpty()) {
                    IO.println("No grades yet");
                } else if (option.equals("2")) {
                    List<String> parts = new ArrayList<>();
                    for (int grade : grades) {
                        parts.add(String.valueOf(grade));
                    }
                    IO.println("Grades: " + String.join(", ", parts));
                } else if (option.equals("3")) {
                    printStatistics(grades);
                } else {
                    for (int grade : grades) {
                        IO.println(grade + " -> " + letter(grade));
                    }
                }
            }
            default -> IO.println("Invalid option");
        }
        option = IO.readln().trim();
    }
    IO.println("Goodbye!");
}
