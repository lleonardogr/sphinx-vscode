import java.util.Scanner;

public class Main {

    // TODO: return n! recursively: 0! is 1, and n! is n * (n - 1)!
    static long factorial(int n) {
        return 1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(n + "! = " + factorial(n));
    }
}
