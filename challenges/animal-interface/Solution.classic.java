import java.util.Scanner;

interface Animal {
    String name();

    String sound();
}

class Dog implements Animal {
    public String name() { return "dog"; }
    public String sound() { return "Woof"; }
}

class Cat implements Animal {
    public String name() { return "cat"; }
    public String sound() { return "Meow"; }
}

class Cow implements Animal {
    public String name() { return "cow"; }
    public String sound() { return "Moo"; }
}

class Duck implements Animal {
    public String name() { return "duck"; }
    public String sound() { return "Quack"; }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Animal[] animals = new Animal[n];
        for (int i = 0; i < n; i++) {
            animals[i] = switch (scanner.next()) {
                case "dog" -> new Dog();
                case "cat" -> new Cat();
                case "cow" -> new Cow();
                default -> new Duck();
            };
        }
        for (Animal animal : animals) {
            System.out.println("The " + animal.name() + " says " + animal.sound() + "!");
        }
    }
}
