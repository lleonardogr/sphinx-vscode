import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String perms = scanner.next();
        String result = "";
        boolean valid = true;
        if (perms.length() == 3) {
            for (int i = 0; i < 3; i++) {
                int d = Character.digit(perms.charAt(i), 8);
                if (d < 0) {
                    valid = false;
                    break;
                }
                result += ((d & 4) == 4 ? "r" : "-") + ((d & 2) == 2 ? "w" : "-") + ((d & 1) == 1 ? "x" : "-");
            }
        } else if (perms.length() == 9) {
            int[] masks = {4, 2, 1};
            for (int g = 0; g < 9 && valid; g += 3) {
                int d = 0;
                for (int i = 0; i < 3; i++) {
                    char c = perms.charAt(g + i);
                    if (c == "rwx".charAt(i)) {
                        d = d | masks[i];
                    } else if (c != '-') {
                        valid = false;
                    }
                }
                result += d;
            }
        } else {
            valid = false;
        }
        System.out.println(valid ? result : "Invalid");
    }
}
