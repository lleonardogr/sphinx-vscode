import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] words = scanner.nextLine().toLowerCase().split(" ");
        Set<String> seen = new HashSet<>();
        String firstRepeat = null;
        for (String word : words) {
            if (!seen.add(word) && firstRepeat == null) {
                firstRepeat = word;
            }
        }
        System.out.println("Unique words: " + seen.size());
        System.out.println(firstRepeat == null ? "No repeats" : "First repeat: " + firstRepeat);
    }
}
