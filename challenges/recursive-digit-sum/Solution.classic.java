import java.util.Scanner;

public class Main {

    static int digitSum(long n) {
        return n == 0 ? 0 : (int) (n % 10) + digitSum(n / 10);
    }

    static int digitalRoot(long n) {
        int s = digitSum(n);
        return s < 10 ? s : digitalRoot(s);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        System.out.println("Digit sum: " + digitSum(n));
        System.out.println("Digital root: " + digitalRoot(n));
    }
}
