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

        // TODO: ordene pela idade (depois nome) e imprima; depois ordene pelo tamanho do nome (maior primeiro, depois nome) e imprima
    }
}
