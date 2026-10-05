import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int k = Integer.parseInt(scanner.nextLine().trim());
        String text = scanner.nextLine().toLowerCase();
        TreeMap<String, Integer> counts = new TreeMap<>();
        StringBuilder word = new StringBuilder();
        for (char c : (text + " ").toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                word.append(c);
            } else if (word.length() > 0) {
                String w = word.toString();
                counts.put(w, counts.getOrDefault(w, 0) + 1);
                word.setLength(0);
            }
        }
        List<String> words = new ArrayList<>(counts.keySet());
        words.sort((a, b) -> counts.get(b) - counts.get(a));
        for (int i = 0; i < k && i < words.size(); i++) {
            System.out.println(words.get(i) + ": " + counts.get(words.get(i)));
        }
    }
}
