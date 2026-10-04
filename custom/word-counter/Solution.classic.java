import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine().trim();
        int words = 0;
        boolean inWord = false;
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(i) == ' ') {
                inWord = false;
            } else if (!inWord) {
                inWord = true;
                words++;
            }
        }
        System.out.println(words);
    }
}
