import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        String out = "";
        for (char c : text.toCharArray()) {
            out += (out.isEmpty() ? "" : " ") + (int) c;
        }
        System.out.println(out);
    }
}
