import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayDeque<String> line = new ArrayDeque<>();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("arrive")) {
                String name = scanner.next();
                line.addLast(name);
                System.out.println(name + " joined at position " + line.size());
            } else if (command.equals("serve")) {
                System.out.println(line.isEmpty() ? "No one waiting" : "Serving " + line.removeFirst());
            } else {
                System.out.println(line.isEmpty() ? "Waiting: nobody" : "Waiting: " + String.join(", ", line));
            }
        }
    }
}
