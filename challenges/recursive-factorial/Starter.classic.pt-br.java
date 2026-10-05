import java.util.Scanner;

public class Main {

    // TODO: devolva n! de forma recursiva: 0! é 1, e n! é n * (n - 1)!
    static long factorial(int n) {
        return 1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(n + "! = " + factorial(n));
    }
}
