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

void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    for (int i = 0; i < n; i++) {
        String name = scanner.next();
        int age = scanner.nextInt();
        Person person = new Person(name, age);
        IO.println(person.introduce());
    }
}
