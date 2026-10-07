import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] hex = scanner.nextLine().trim().split(" "); // 30 bytes, for example ["42", "4D", ...]

        // TODO: turn the hex strings into numbers, check for BM, then read the little-endian fields
    }
}
