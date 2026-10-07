import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double x = Double.parseDouble(scanner.next());
        String bits = "";
        for (int i = 0; i < 12 && x != 0; i++) {
            x = x * 2;
            int bit = (int) x;
            bits += bit;
            x = x - bit;
        }
        if (bits.isEmpty()) {
            bits = "0";
        }
        System.out.println("0." + bits + (x != 0 ? "..." : ""));
    }
}
