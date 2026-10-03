import java.util.Scanner;

class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    String introduce() {
        return "Hi, I'm " + name + " and I'm " + age + " years old.";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            int age = scanner.nextInt();
            Person person = new Person(name, age);
            System.out.println(person.introduce());
        }
    }
}
