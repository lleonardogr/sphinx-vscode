import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int value = n < 0 ? n + 256 : n;
        StringBuilder bits = new StringBuilder();
        for (int place = 128; place >= 1; place /= 2) {
            if (value >= place) {
                bits.append('1');
                value -= place;
            } else {
                bits.append('0');
            }
        }
        System.out.println(bits);
    }
}
