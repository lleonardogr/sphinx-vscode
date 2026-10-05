import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String first = scanner.nextLine().toLowerCase().replace(" ", "");
        String second = scanner.nextLine().toLowerCase().replace(" ", "");
        boolean same = true;
        for (char c = 'a'; c <= 'z'; c++) {
            int a = 0, b = 0;
            for (char x : first.toCharArray()) if (x == c) a++;
            for (char x : second.toCharArray()) if (x == c) b++;
            if (a != b) same = false;
        }
        System.out.println(same ? "Anagrams" : "Not anagrams");
    }
}
