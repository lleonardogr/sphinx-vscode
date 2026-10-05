import java.util.Scanner;

public class Main {

    // TODO: return true if text reads the same backwards, recursively
    static boolean isPalindrome(String text) {
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine().trim();
        String clean = line.toLowerCase().replaceAll("[^a-z0-9]", "");
        System.out.println("\"" + line + "\" " + (isPalindrome(clean) ? "is" : "is not") + " a palindrome");
    }
}
