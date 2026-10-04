import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<String> items = new ArrayList<>();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            switch (command) {
                case "add" -> items.add(scanner.next());
                case "remove" -> {
                    String item = scanner.next();
                    System.out.println(items.remove(item) ? "Removed " + item : item + " not found");
                }
                case "count" -> System.out.println("Items: " + items.size());
                default -> System.out.println(items.isEmpty() ? "(empty)" : String.join(", ", items));
            }
        }
    }
}
