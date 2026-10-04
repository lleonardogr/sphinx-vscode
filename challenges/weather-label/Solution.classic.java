import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int temperature = scanner.nextInt();
        String label = temperature > 30 ? "Hot" : (temperature < 10 ? "Cold" : "Mild");
        System.out.println(label);
    }
}
