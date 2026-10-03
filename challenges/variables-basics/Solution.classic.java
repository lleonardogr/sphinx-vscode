import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        int age = scanner.nextInt();
        System.out.println("Hello, " + name + "!");
        System.out.println("Next year you will be " + (age + 1) + " years old.");
    }
}
