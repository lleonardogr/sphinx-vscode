import java.util.ArrayList;
import java.util.Scanner;

public class Main {

    // The reflected list: the (n - 1)-bit list with 0 in front, then reversed with 1 in front.
    static ArrayList<String> grayCodes(int n) {
        ArrayList<String> codes = new ArrayList<>();
        codes.add("0");
        codes.add("1");
        for (int bits = 2; bits <= n; bits++) {
            ArrayList<String> next = new ArrayList<>();
            for (String code : codes) {
                next.add("0" + code);
            }
            for (int i = codes.size() - 1; i >= 0; i--) {
                next.add("1" + codes.get(i));
            }
            codes = next;
        }
        return codes;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int k = scanner.nextInt();
        ArrayList<String> codes = grayCodes(n);
        String previous = null;
        int glitches = 0;
        for (int i = 0; i < k; i++) {
            String reading = scanner.next();
            System.out.println(reading + " -> " + codes.indexOf(reading));
            if (previous != null) {
                int differences = 0;
                for (int b = 0; b < reading.length(); b++) {
                    if (reading.charAt(b) != previous.charAt(b)) {
                        differences++;
                    }
                }
                if (differences >= 2) {
                    glitches++;
                }
            }
            previous = reading;
        }
        System.out.println("Glitches: " + glitches);
    }
}
