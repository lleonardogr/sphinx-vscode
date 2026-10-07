import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int code = Integer.parseInt(scanner.next().substring(2), 16); // U+00E9 -> 233

        // TODO: work out how many bytes are needed, build them and print them in hex, separated by spaces
    }
}
