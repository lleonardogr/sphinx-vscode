import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        char[] chars = text.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            int code = chars[i];
            if (code >= 65 && code <= 90) {
                chars[i] = (char) (code + ('a' - 'A'));
            } else if (code >= 97 && code <= 122) {
                chars[i] = (char) (code - ('a' - 'A'));
            }
        }
        System.out.println(new String(chars));
    }
}
