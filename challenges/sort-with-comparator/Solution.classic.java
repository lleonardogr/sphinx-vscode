import java.util.*;

record Person(String name, int age) {}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        List<Person> people = new ArrayList<>();
        for (String entry : line.split(" ")) {
            String[] p = entry.split(":");
            people.add(new Person(p[0], Integer.parseInt(p[1])));
        }
        people.sort(Comparator.comparing(Person::age).thenComparing(Person::name));
        System.out.println("By age:");
        for (Person p : people) System.out.println("  " + p.age() + " " + p.name());
        people.sort(Comparator.comparing((Person p) -> p.name().length()).reversed().thenComparing(Person::name));
        System.out.println("By name length:");
        for (Person p : people) System.out.println("  " + p.name());
    }
}
