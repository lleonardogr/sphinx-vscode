import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] words = scanner.nextLine().trim().split(" ");
        LinkedHashSet<String> unique = new LinkedHashSet<>(Arrays.asList(words));
        System.out.println("Unique: " + String.join(" ", unique));
        System.out.println("Removed duplicates: " + (words.length - unique.size()));
    }
}
