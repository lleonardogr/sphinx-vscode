import java.util.Scanner;

public class Main {

    static int parity(int n) {
        int p = 0;
        for (int k = 0; k < 31; k++) {
            p ^= (n >> k) & 1;
        }
        return p;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sent = scanner.nextInt();
        int received = scanner.nextInt();
        int ones = 0;
        for (int k = 0; k < 31; k++) {
            if (((sent >> k) & 1) == 1) {
                ones++;
            }
        }
        System.out.println("Ones: " + ones);
        System.out.println("Parity bit: " + parity(sent));
        System.out.println(parity(sent) == parity(received) ? "Received: OK" : "Received: error detected");
    }
}
