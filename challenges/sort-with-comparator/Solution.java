record Person(String name, int age) {}

void main() {
    String line = IO.readln().trim();
    List<Person> people = new ArrayList<>();
    for (String entry : line.split(" ")) {
        String[] p = entry.split(":");
        people.add(new Person(p[0], Integer.parseInt(p[1])));
    }
    people.sort(Comparator.comparingInt(Person::age).thenComparing(Person::name));
    IO.println("By age:");
    people.forEach(p -> IO.println("  " + p.age() + " " + p.name()));

    people.sort((a, b) -> b.name().length() != a.name().length() ? b.name().length() - a.name().length() : a.name().compareTo(b.name()));
    IO.println("By name length:");
    people.forEach(p -> IO.println("  " + p.name()));
}
