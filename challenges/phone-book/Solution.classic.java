import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        TreeMap<String, String> book = new TreeMap<>();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("list")) {
                if (book.isEmpty()) System.out.println("Phone book is empty");
                for (String name : book.keySet()) System.out.println(name + ": " + book.get(name));
                continue;
            }
            String name = scanner.next();
            if (command.equals("add")) {
                String number = scanner.next();
                System.out.println((book.containsKey(name) ? "Updated " : "Added ") + name);
                book.put(name, number);
            } else if (!book.containsKey(name)) {
                System.out.println(name + " not found");
            } else if (command.equals("find")) {
                System.out.println(name + ": " + book.get(name));
            } else {
                book.remove(name);
                System.out.println("Removed " + name);
            }
        }
    }
}
