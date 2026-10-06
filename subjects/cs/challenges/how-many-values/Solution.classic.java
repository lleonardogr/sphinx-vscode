import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long values = 1;
        int i = 0;
        while (i < n) {
            values = values + values;
            i++;
        }
        System.out.println("Values: " + values);
        System.out.println("Largest: " + (values - 1));
    }
}
