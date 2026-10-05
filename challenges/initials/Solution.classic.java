import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim();
        String initials = "";
        for (int i = 0; i < name.length(); i++) {
            boolean starts = name.charAt(i) != ' ' && (i == 0 || name.charAt(i - 1) == ' ');
            if (starts) initials += Character.toUpperCase(name.charAt(i)) + ".";
        }
        System.out.println(initials);
    }
}
