import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<String, List<String>> groups = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String word = scanner.next();
            char[] letters = word.toCharArray();
            Arrays.sort(letters);
            groups.computeIfAbsent(String.valueOf(letters), k -> new ArrayList<>()).add(word);
        }
        int largest = 0, alone = 0;
        for (List<String> group : groups.values()) {
            if (group.size() > largest) {
                largest = group.size();
            }
            if (group.size() == 1) {
                alone++;
            }
        }
        System.out.println("groups: " + groups.size());
        System.out.println("largest group: " + largest);
        System.out.println("alone: " + alone);
    }
}
