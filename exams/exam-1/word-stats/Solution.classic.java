import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        int words = 0, vowels = 0;
        String longest = "";
        for (String word : line.split("\\s+")) {
            words++;
            if (word.length() > longest.length()) longest = word;
            for (char c : word.toLowerCase().toCharArray()) {
                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') vowels++;
            }
        }
        System.out.println("Words: " + words);
        System.out.println("Longest: " + longest);
        System.out.println("Vowels: " + vowels);
    }
}
