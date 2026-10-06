import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        StringBuilder bits = new StringBuilder();
        do {
            bits.append(n % 2);
            n /= 2;
        } while (n > 0);
        System.out.println(bits.reverse());
    }
}
