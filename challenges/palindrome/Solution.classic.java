import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String word = scanner.next().toLowerCase();
        boolean palindrome = true;
        for (int i = 0; i < word.length() / 2; i++) {
            if (word.charAt(i) != word.charAt(word.length() - 1 - i)) {
                palindrome = false;
                break;
            }
        }
        System.out.println(palindrome ? "Palindrome" : "Not a palindrome");
    }
}
