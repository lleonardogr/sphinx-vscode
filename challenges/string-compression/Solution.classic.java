import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().trim();
        StringBuilder compressed = new StringBuilder();
        int i = 0;
        while (i < text.length()) {
            int j = i;
            while (j < text.length() && text.charAt(j) == text.charAt(i)) j++;
            compressed.append(text.charAt(i)).append(j - i);
            i = j;
        }
        System.out.println(compressed.length() < text.length() ? compressed : text);
    }
}
