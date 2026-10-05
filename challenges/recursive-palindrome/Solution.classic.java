import java.util.Scanner;

public class Main {

    static boolean isPalindrome(String text) {
        return isPalindrome(text, 0, text.length() - 1);
    }

    static boolean isPalindrome(String text, int left, int right) {
        if (left >= right) return true;
        return text.charAt(left) == text.charAt(right) && isPalindrome(text, left + 1, right - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
        System.out.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
    }
}
