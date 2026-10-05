void main() {
    Map<String, Set<String>> byCourse = new HashMap<>();
    Map<String, Set<String>> byStudent = new HashMap<>();
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        switch (p[0]) {
            case "enroll" -> {
                boolean added = byCourse.computeIfAbsent(p[2], k -> new TreeSet<>()).add(p[1]);
                byStudent.computeIfAbsent(p[1], k -> new TreeSet<>()).add(p[2]);
                IO.println(added ? "Enrolled " + p[1] + " in " + p[2] : p[1] + " is already in " + p[2]);
            }
            case "drop" -> {
                boolean removed = byCourse.getOrDefault(p[2], Set.of()).contains(p[1]);
                if (removed) {
                    byCourse.get(p[2]).remove(p[1]);
                    byStudent.get(p[1]).remove(p[2]);
                }
                IO.println(removed ? "Dropped " + p[1] + " from " + p[2] : p[1] + " is not in " + p[2]);
            }
            case "roster" -> {
                Set<String> students = byCourse.getOrDefault(p[1], Set.of());
                IO.println(students.isEmpty() ? p[1] + " has no students" : p[1] + ": " + String.join(", ", students));
            }
            case "courses" -> {
                Set<String> courses = byStudent.getOrDefault(p[1], Set.of());
                IO.println(courses.isEmpty() ? p[1] + " has no courses" : p[1] + ": " + String.join(", ", courses));
            }
        }
    }
}
