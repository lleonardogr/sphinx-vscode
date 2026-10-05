import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String sentence = scanner.nextLine().trim().toLowerCase();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < sentence.length(); i++) {
            char c = sentence.charAt(i);
            out.append(i == 0 || sentence.charAt(i - 1) == ' ' ? Character.toUpperCase(c) : c);
        }
        System.out.println(out);
    }
}
