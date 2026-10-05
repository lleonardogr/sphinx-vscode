record Grade(String student, String course, int score) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Grade> grades = Stream.generate(IO::readln)
            .limit(n)
            .map(line -> line.trim().split(" "))
            .map(p -> new Grade(p[0], p[1], Integer.parseInt(p[2])))
            .toList();

    Map<String, List<Grade>> byCourse = grades.stream().collect(Collectors.groupingBy(Grade::course, TreeMap::new, Collectors.toList()));
    Map<String, Double> averages = grades.stream().collect(Collectors.groupingBy(Grade::student, TreeMap::new, Collectors.averagingInt(Grade::score)));

    IO.println("Students: " + averages.size() + ", courses: " + byCourse.size());
    byCourse.forEach((course, list) -> {
        double avg = list.stream().mapToInt(Grade::score).average().orElse(0);
        Grade best = list.stream()
                .sorted(Comparator.comparingInt(Grade::score).reversed().thenComparing(Grade::student))
                .findFirst().orElseThrow();
        IO.println("%s: average %.1f, best %s (%d)".formatted(course, avg, best.student(), best.score()));
    });
    Map.Entry<String, Double> top = averages.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))
            .findFirst().orElseThrow();
    IO.println("Top student: %s (average %.1f)".formatted(top.getKey(), top.getValue()));
    String below = grades.stream()
            .filter(g -> g.score() < 60)
            .sorted(Comparator.comparing(Grade::student).thenComparing(Grade::course))
            .map(g -> g.student() + " (" + g.course() + " " + g.score() + ")")
            .collect(Collectors.joining(", "));
    IO.println("Below 60: " + (below.isEmpty() ? "none" : below));
}
