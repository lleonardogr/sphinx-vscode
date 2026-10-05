record Student(String name, int score) {}

String names(List<Student> group) {
    return group.isEmpty() ? "none" : group.stream().map(Student::name).collect(Collectors.joining(", "));
}

void main() {
    String line = IO.readln().trim();
    List<Student> students = Arrays.stream(line.split(" "))
            .map(entry -> entry.split(":"))
            .map(p -> new Student(p[0], Integer.parseInt(p[1])))
            .toList();
    Map<Boolean, List<Student>> groups = students.stream().collect(Collectors.partitioningBy(s -> s.score() >= 60));
    IO.println("Passed (" + groups.get(true).size() + "): " + names(groups.get(true)));
    IO.println("Failed (" + groups.get(false).size() + "): " + names(groups.get(false)));
    IO.println("Average: %.1f".formatted(students.stream().mapToInt(Student::score).average().getAsDouble()));
}
